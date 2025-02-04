const db = require("../db/dbModel");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/AsyncHandlerWrapper");
const { where } = require("sequelize");
const { generateToken, verifyPassword, hashPassword, generateRefreshToken, checkMiddlewareCurrentUser } = require("../utils/CommonMethod");
const jwt = require("jsonwebtoken");
const secretKey = require("../utils/constants");

// Global Variable.
var userIdForRollback;


const login = asyncHandler(async (req, res) => {
    // UserLogin -> Empnumber using in userlogin fornow. But in future will change in more flezible.
    let { userlogin, userPassword } = req.body;

    if (!userlogin && !userPassword) throw new ApiError(401, "Please Enter your credentails");

    let userDetails = await db.Users.findOne({ where: { UserLogin: userlogin } });

    if (!userDetails) throw new ApiError(401, "user not found");

    let verifyUser = await verifyPassword(userPassword, userDetails.Password);

    if (!verifyUser) throw new ApiError(401, "Invalid credentials");

    const token = generateToken(userDetails);
    const refreshToken = generateRefreshToken(userDetails);

    await db.Users.update(
        { RefreshToken: refreshToken },
        {
            where: { UserId: userDetails.UserId }
        }
    );

    const options = {
        httpOnly: true, // Prevents JavaScript access
        secure: true, // Ensures cookie is sent over HTTPS
        sameSite: 'Strict' // Prevents cross-site request forgery
    }

    res.setHeader("Authorization", `Bearer ${token}`);

    res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(201, "User loggedIn successfully"));
});

// This delete User function calls in catch function.
const rollbackData = async (userId) => {
    try {
        let deleteUserDetails = await db.Users.destroy({ where: { UserId: userId } });
        return deleteUserDetails;
    }
    catch (error) {
        return {
            message: error.message,
            Status: "Failure"
        }
    }
}

// With this Api will create users like other roles except admin.
// Note :- Throw keyword not correctly work with try catch, we will send the Error status on response. IF we need to use throw then required to use asyncHandlerwrapper.
const createUser = async (userObj) => {
    try {
        let { fullName, email, userLogin, userPassword } = userObj;

        let existingUser = await db.Users.findOne({ where: { UserEmail: email } });

        if (existingUser) throw new ApiError(403, "User already exists");

        let usersHashPassword = await hashPassword(userPassword);

        let newUserDetail = await db.Users.create({
            Fullname: fullName,
            UserEmail: email,
            UserLogin: userLogin,
            Password: usersHashPassword,
            IsActive: 1,
            Blocked: 0,
            IsDeleted: 0
        });

        return newUserDetail;

    } catch (error) {
        return {
            message: error.message,
            Status: "Failure"
        };
    }
};

const changePassword = asyncHandler(async (req, res) => {
    let { email, newPassword, oldPassword } = req.body;

    if (!email && !newPassword && !oldPassword) throw new ApiError(401, "Enter Value in field");

    let user = await db.Users.findOne({ where: { UserEmail: email } });

    if (!user) throw new ApiError(401, "User not found");

    if (user.Password !== oldPassword) throw new ApiError("Invalid Old Password");

    let newHashPassword = await hashPassword(newPassword);

    let updateUserDetail = await db.Users.update({ Password: newHashPassword }, {
        where: {
            UserEmail: email
        }
    });

    return res.status(200).json(new ApiResponse(201, "Password Changed Successfully", updateUserDetail));
});

// This will create the User Role.
const createUserRole = async (userId, role) => {
    try {
        let roleDetails = await db.UserRole.create({ UserId: userId, Role: role });

        return roleDetails;

    } catch (error) {
        await rollbackData(userId);
        return{
            message: error.message,
            Status: "Failure"
        }
    }
};

// This API used for internal Purpose only to create Admin users only.
// Note :- Throw keyword not correctly work with try catch, we will send the Error status on response. IF we need to use throw then required to use asyncHandlerwrapper.
const createAdmin = async (req, res) => {
    try {
        let { fullName, email, userLogin } = req.body;

        if (!fullName || !email) throw new ApiError(401, "Fields Empty");

        let existingUser = await db.Users.findOne({ where: { UserEmail: email } });

        if (existingUser) return res.status(400).send({ StatusCode: 401, ErrorMsg: "User already exists" });

        // we use the default Password for Admin User -> AdminPass@123
        let newUserDetail = await db.Users.create({
            Fullname: fullName,
            UserEmail: email,
            UserLogin: userLogin,
            Password: await hashPassword("Admin@00123"),
            IsActive: 1,
            Blocked: 0,
            IsDeleted: 0
        });

        userIdForRollback = newUserDetail?.UserId;

        await createUserRole(newUserDetail.UserId, "Admin");

        return res.status(200).
            json(
                new ApiResponse(
                    201,
                    "User Created with Admin Role",
                    { Login: newUserDetail["UserLogin"], Password: "Admin@00123" }
                )
            );

    } catch (error) {
        await rollbackData(userIdForRollback);
        res.status(500).send({
            message: error.message,
            Status: "Failure"
        })
    }
};


// This method used for re-generateAccess token on the basis of refreshtoken. When Access Token has been expired , this api will hit from frontend.
const regenerateAccessTokenRefresh = async (req, res) => {
    try {
        let incomingRefreshToken = req.cookies.refreshToken;

        if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized user access");

        // Verify the refresh token using a promise-based approach
        let userIdFromRefreshToken = await jwt.verify(incomingRefreshToken, secretKey);

        let getUserDetail = await db.Users.findOne({ where: { UserId: userIdFromRefreshToken["userId"] } });

        if (!getUserDetail) throw new ApiError(401, "User not found");

        // Here we validate the refresh token from db.
        if (getUserDetail.RefreshToken !== incomingRefreshToken) throw new ApiError(401, "Unauthorized User");

        let regenerateRefreshToken = generateRefreshToken(getUserDetail);
        let regenerateAccessToken = generateToken(getUserDetail);

        // Now update the refresh token and set the new token in Header.
        await db.Users.update(
            { RefreshToken: regenerateRefreshToken },
            {
                where: { UserId: getUserDetail.UserId }
            }
        );

        const options = {
            httpOnly: true, // Prevents JavaScript access
            secure: true, // Ensures cookie is sent over HTTPS
            sameSite: 'Strict' // Prevents cross-site request forgery
        }

        req.currentUserId = getUserDetail.UserId;

        res.setHeader("Authorization", `Bearer ${regenerateAccessToken}`);

        return res.cookie("refreshToken", regenerateRefreshToken, options);

    } catch (err) {
        // Handle JWT verification errors and other errors
        if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {

            req.refreshTokenError = {errorname : err.name}

            return res.status(401).json({ message: "Invalid or expired refresh token", error: err.name });
        }

        // Generic error response
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

// This api returns the current user details with error.
const currentUserDetails = asyncHandler((req, res) => {
    try {
        let currentUserDetails = req.user;

        return res.status(200).json(new ApiResponse(201, "User Details", currentUserDetails));

    } catch (error) {
        // If an error occurs in the try block or any called methods, we throw it to let asyncHandler catch and handle it automatically.
        // This removes the need to manually handle the error here.
        throw error;
    }
});


module.exports = {
    login,
    createUser,
    changePassword,
    createUserRole,
    rollbackData,
    createAdmin,
    regenerateAccessTokenRefresh,
    currentUserDetails
};
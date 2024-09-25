const db = require("../db/dbModel");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/AsyncHandlerWrapper");
const { where } = require("sequelize");
const { generateToken, verifyPassword, hashPassword } = require("../utils/CommonMethod");

// In this controller we will create some function like login, logout, refreshtoken, changepassword.
const login = asyncHandler(async (req, res) => {
    let { userlogin, userPassword } = req.body;

    if (!userlogin && !userPassword) throw new ApiError(401, "Please Enter your credentails");

    let userDetails = await db.Users.findOne({ where: { UserLogin: userlogin } });

    if (!userDetails) throw new ApiError(401, "user not found");

    let verifyUser = await verifyPassword(userPassword, userDetails.Password);

    if (!verifyUser) throw new ApiError(401, "Invalid credentials");

    const token = generateToken(userDetails);

    res.setHeader("Authorization", `Bearer ${token}`);

    res.status(200).json(new ApiResponse(201, "User loggedIn successfully"));
});

const createUser = async (userObj) => {
    try {
        let { fullName, email, userLogin, userPassword } = userObj;

        let existingUser = await db.Users.findOne({ where: { UserEmail: email } });

        if (existingUser) throw new ApiError(401, "User already exists");

        let newUserDetail = await db.Users.create({
            Fullname: fullName,
            UserEmail: email,
            UserLogin: userLogin,
            Password: await hashPassword(userPassword)
        });

        if (!newUserDetail) throw new ApiError(401, "Internal error");

        return newUserDetail;

    } catch (error) {
        throw new ApiError(401, error.message);
    }
};

const changePassword = asyncHandler(async (req, res) => {
    let { email, newPassword, oldPassword } = req.body;

    let {fullName, useremail, userId } = req.user;

    if (!email && !newPassword && !oldPassword) throw new ApiError(401, "Enter Value in field");

    let user = await db.Users.findOne({ where: { UserEmail: email } });

    if (!user) throw new ApiError(401, "User not found");

    if (user.Password !== oldPassword) throw new ApiError("Invalid Old Password");

    let newHashPassword = await hashPassword(newPassword);

    let updateUserDetail = await db.Users.update({ Password: newHashPassword }, {
        where: {
            UserEmail : email
        }
    });

    return res.status(200).json(new ApiResponse(201, "Password Changed Successfully", updateUserDetail));
});

const userRole = asyncHandler(async (req, res) => {

});

// Need to add code for logout, refresh-token, updateAccountInfo(if email would be change), login if user wnats to change the login, GetCurrentUserDetails.

module.exports = { 
    login, 
    createUser,
    changePassword 
};
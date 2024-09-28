var bcrypt = require('bcryptjs');
const secretKey = require('./constants');
const jwt = require("jsonwebtoken");
const asyncHandler = require('./AsyncHandlerWrapper');
const db = require('../db/dbModel');
const ApiError = require('./ApiError');
const { where } = require('sequelize');

const generateToken = (userDetail) => {
    const payload = {
        userId : userDetail.UserId,
        fullName : userDetail.Fullname,
        email : userDetail.UserEmail
    }

    const jwtOtions = {
        expiresIn : "1m"
    }

    return jwt.sign(payload, secretKey, jwtOtions);
}

const generateRefreshToken = (userDetail) => {
    const payload = {
        userId : userDetail.UserId,
        refreshToken : "RefreshTokenKey"
    }

    const jwtOtions = {
        expiresIn : "1d"
    }

    return jwt.sign(payload, secretKey, jwtOtions);
}

const hashPassword = async (userNewPassword) => {
    let salt = await bcrypt.genSalt(10);
    let hashPass = await bcrypt.hash(userNewPassword, salt);
    return hashPass;
}

const verifyPassword = async (enteredPassword, userPassword) => {
    let validPassword = await bcrypt.compare(enteredPassword, userPassword);
    return validPassword;
}

// This function returns the middleware output.
const checkMiddlewareOutput = (req) => {
    if(req.TokenError) return req.TokenError;

    if(req.UserNotExistError) return req.UserNotExistError;

    return req.user;
}


const checkEmpNumberWithUserRoleAndExists = asyncHandler(async (empNumber, userId) => {
    // Here we check EmpNumber is exist or not. Get EmpId and Userid. 
    // We check userrole with the given userId. And Then allow to save and edit. 
    // With UserId we validate the userRole.
    let empDetails = await db.Employee.findOne({where : {Empnumber : empNumber}});

    if(!empDetails) throw new ApiError(401, "This employee not found");

    let userRoleDetails = await db.UserRole.findOne({where : {UserId : userId}});

    if(!userRoleDetails) throw new ApiError(401, "This user not found");

    if(userRoleDetails.Role === "Employee") throw new ApiError(401, "you don't have access to add details");

    return {...userRoleDetails, ...empDetails};
});

module.exports = {
    generateToken,
    hashPassword,
    verifyPassword,
    checkEmpNumberWithUserRoleAndExists,
    generateRefreshToken,
    checkMiddlewareOutput
}
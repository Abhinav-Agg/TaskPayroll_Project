var bcrypt = require('bcryptjs');
const secretKey = require('./constants');
const jwt = require("jsonwebtoken");
const db = require('../db/dbModel');
const ApiError = require('./ApiError');
const { v4: uuidv4 } = require('uuid');
const { where } = require('sequelize');

const generateToken = (userDetail) => {
    const payload = {
        userId : userDetail.UserId,
        fullName : userDetail.Fullname,
        email : userDetail.UserEmail,
        iat: Math.floor(Date.now() / 1000),
        jti: uuidv4()
    }

    const jwtOtions = {
        expiresIn : "10m"
    }

    return jwt.sign(payload, secretKey, jwtOtions);
}

const generateRefreshToken = (userDetail) => {
    const payload = {
        userId : userDetail.UserId,
        refreshToken: uuidv4()
    }

    const jwtOtions = {
        expiresIn : "30m"
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
    if(req.TokenError) throw new ApiError(500, "Invalid Token");

    if(req.UserNotExistError) throw new ApiError(500, req.UserNotExistError);

    return req.user;
};

const findEmpDetail = async (userId) => {

    const empDetail = await db.Employee.findOne({where : {UserId : userId}});

    let checkEmpDetail = (!empDetail) ? {ErrorMsg : "Employee Not Found"} : empDetail;

    return checkEmpDetail;
}


const validateEmpwithEmpNumber = async (empNumber) => {

    let empDetailsInstances = await db.Employee.findOne({where : {Empnumber : empNumber}});
    
    if(!empDetailsInstances) return res.status(400).send({"ErrorMsg" : "This employee not found"});

    return empDetailsInstances;
};

module.exports = {
    generateToken,
    hashPassword,
    verifyPassword,
    validateEmpwithEmpNumber,
    generateRefreshToken,
    checkMiddlewareOutput,
    findEmpDetail
}
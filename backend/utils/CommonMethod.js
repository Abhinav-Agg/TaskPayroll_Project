var bcrypt = require('bcryptjs');
const secretKey = require('./constants');
const jwt = require("jsonwebtoken");
const db = require('../db/dbModel');
const ApiError = require('./ApiError');
const { v4: uuidv4 } = require('uuid');
const { where } = require('sequelize');
const fs = require('node:fs');

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

const findEmpDetail = async (userId) => {

    const empDetail = await db.Employee.findOne({where : {UserId : userId}});

    let checkEmpDetail = (!empDetail) ? {ErrorMsg : "Employee Not Found"} : empDetail;

    return checkEmpDetail;
}


const validateEmpwithEmpNumber = async (empNumber) => {

    let empDetailsInstances = await db.Employee.findOne({where : {Empnumber : empNumber}});

    let validEmpDetail = (!empDetailsInstances) ? {ErrorMsg : "This employee not found"} : empDetailsInstances;

    return validEmpDetail;
};

// This function used for getting import files data.
const readfileData = async (impFilepath) => {
    // with promise class will achieve data from events.
    return new Promise((resolve, reject) => {
        const readableStream = fs.createReadStream(impFilepath, {
            encoding : "utf-8"
        });
        
        let data = ''; // Variable to store data from each chunk
    
        readableStream.on("data", (chunk) => {
            data += chunk;
            resolve(data)
        });
    
        readableStream.on('end', () => {
            resolve(data);
        });

        readableStream.on("error", (err) => {
            reject(err);
        });
    });
}

// Quick Sort
const sorting = (arr) => {
    let leftarr = [];
    let rightarr = [];
    let pivot = arr[0];  // assumed random element.

    if(arr.length <= 0) return arr;

    for(let i = 1; i < arr.length; i++){
        if(arr[i] < pivot){
            leftarr.push(arr[i]);
        }
        else{
            rightarr.push(arr[i]);
        }
    }

    return [...sorting(leftarr), pivot, ...sorting(rightarr)];  // Here we add pivot beacuse at end it will be a median because we take as starting element for ref.
}

//checkMiddlewareCurrentUser
module.exports = {
    generateToken,
    hashPassword,
    verifyPassword,
    validateEmpwithEmpNumber,
    generateRefreshToken,
    findEmpDetail,
    readfileData,
    sorting
}
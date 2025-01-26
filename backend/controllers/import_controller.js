const db = require("../db/dbModel");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandlerWrapper");
const { createUser, createUserRole } = require("./user_controller");
const ApiResponse = require("../utils/ApiResponse");

const { checkMiddlewareCurrentUser, readfileData} = require("../utils/CommonMethod");

// API -> In this we will add bulk employees
const addBulkEmployee = asyncHandler(async(req, res) => {
    let {path} = req.file;

    let currentUser = req.user;

    let myHeaderLength = 7; // Static length Its based on given Excel header

    let filedata = await readfileData(path);
    
    let d = filedata.split("\r\n");  

    let headerData = d[0].split(",");  // I separated each header column.

    if(headerData.length > myHeaderLength) throw new ApiError(406, "columns exceeded");
    
    let rowData = [];
    for(let i = 1; i < d.length; i++){
        if (d[i].trim().length <= 1) continue;
        rowData.push(d[i].trim().split(","));
    }
    
    // For Import Users Default Password
    let defaultPassword = "Passw0rd@#123";
    
    let empData = new Map();
    let eachUserDetail = [];

    rowData.map((data, index) => {
        let eachRowData = new Map();

        headerData.forEach((headerData, index) => {
            eachRowData.set(headerData, data[index]);
            eachRowData.set("CreatedBy", currentUser.UserId);
            eachRowData.set("IsDeleted", 0);
            eachRowData.set("IsActive", 1);
            eachRowData.set("UserLogin", data[1]);  // For import Employees they are use Email for login
            eachRowData.set("Password", defaultPassword);
        });

        
        empData.set(index, eachRowData);  // adding index for unique keys otherwise it will not adding other values.
            /*
            -->> I have trying to push empData in the empty array but getting same value due to below reason.
                This code shows the same data for each entry in `eachEachData` because `empData` is a reference to the same Map.
                When we add `empData` to `eachEachData`, we are adding a reference to the same object, not a copy of its current values.
                As a result, each time `empData` is updated, all entries in `eachEachData` reflect these new values.
                To fix this, we need to create a new `Map` for each row, so each entry in `eachEachData` has its own unique values.
            */                
        let userD = {};
        
        userD["fullName"] = `I_${eachRowData.get("FullName")}`;
        userD["email"] = eachRowData.get("Email");
        userD["userPassword"] = eachRowData.get("Password");
        userD["userLogin"] = eachRowData.get("UserLogin");

        eachUserDetail.push(createUser(userD));
    });

    let userDetails = await Promise.all(eachUserDetail);

    let eachUserRoleDetail = [];
    let eachEmpDetail = [];

    empData.forEach((data, index) => {
        if(userDetails[index].Status === 'Failure'){
            return;
        }

        let empdataobj = {
            "FullName" : `I_${data.get("FullName")}`,
            "Empnumber" : data.get("Empnumber"),
            "Email" : data.get("Email"),
            "Address" : data.get("Address"),
            "UserId" : userDetails[index].UserId,
            "IsDeleted" : data.get("IsDeleted"),
            "IsActive" : data.get("IsActive"),
            "EmpDepartment" : data.get("EmpDepartment"),
            "EmpDesignation" : data.get("EmpDesignation"),
            "EmpRole" : data.get("EmpRole"),
            "CreatedBy" : data.get("CreatedBy"),
        };

        eachUserRoleDetail.push(createUserRole(userDetails[index].UserId, data.get("EmpRole")));
        eachEmpDetail.push(empdataobj);
    });

    if(eachUserRoleDetail.length === 0 && eachEmpDetail.length === 0){
        return res.status(200).json(new ApiResponse(201, "All Details are already in Database", userDetails));
    }

    let getnewEmpUserRoleDetails = await Promise.all(eachUserRoleDetail, db.Employee.bulkCreate(eachEmpDetail));

    return res.status(200).json(new ApiResponse(201, "Data Imported Successfully", {...getnewEmpUserRoleDetails, ...userDetails}));
});

module.exports = {addBulkEmployee};
const { Sequelize } = require("sequelize");
const sequelize = require("./dbConfig");
const Users = require('../models/User_model');
const Employee = require('../models/Employee_model');
const Salary = require('../models/Salary_model');
const Leaves = require('../models/Leaves_model');
const Task = require('../models/Task_model');
const EmployeeTimentry = require('../models/EmployeeTimentry_model');
const UserRole = require('../models/UserRole_model');
const EmployeeLeaves = require('../models/EmployeeLeave_model');

let db = {};

db.Users = Users(sequelize);
db.Employee = Employee(sequelize);
db.Salary = Salary(sequelize);
db.Leaves = Leaves(sequelize);
db.Task = Task(sequelize);
db.EmployeeTimentry = EmployeeTimentry(sequelize);
db.UserRole = UserRole(sequelize);
db.EmployeeLeaves = EmployeeLeaves(sequelize);

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
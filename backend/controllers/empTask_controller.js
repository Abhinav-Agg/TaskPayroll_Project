const { Op, where, Sequelize } = require("sequelize");
const db = require("../db/dbModel");
const asyncHandler = require("../utils/AsyncHandlerWrapper");
const { checkMiddlewareOutput } = require("../utils/CommonMethod");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const saveEmpTask = asyncHandler(async (req, res) => {

    let { TaskName, TaskDescription, Hrs } = req.body;

    let currentUserDetails = checkMiddlewareOutput(req);

    if (currentUserDetails.name === 'TokenExpiredError') throw new ApiError(401, currentUserDetails.message);

    // This logic -> Any Emp only enter his details on one add or allow to add tasks.
    let { UserId, UserEmail } = currentUserDetails;

    let empdetail = await db.Employee.findOne(
        {
            where: {
                [Op.and]: [{ UserId }, { Email: UserEmail }]
            }
        }
    );

    if (!empdetail) throw new ApiError(401, "Emp not found");

    let newEmpTaskDetail = await db.Task.create({
        Empnumber: empdetail.Empnumber,
        TaskName,
        TaskDescription,
        Hours: Hrs,
        CreatedBy: UserId,
        IsDeleted: 0,
        CreatedAt: new Date(),
        UpdatedAt: new Date()
    });

    return res.status(200).json(new ApiResponse(201, "Task Created Successfully", newEmpTaskDetail));
});


// updateEmpTask -> In this Emp have able to update their entry not other Employees.
const updateEmpTask = asyncHandler(async (req, res) => {
    let { TaskName, TaskDescription, Hrs } = req.body;

    let currentUserDetails = checkMiddlewareOutput(req);

    if (currentUserDetails.name === 'TokenExpiredError') throw new ApiError(401, currentUserDetails.message);

    let { UserId, UserEmail } = currentUserDetails;

    /* This query retrieves data where the user wants to update their own task entry, preventing other employees from updating it. */
    // For Joins -> We need to use associations defined in the models, not necessarily in the migrations.
    let taskDetailInstance = await db.Task.findAll({
        attributes: ["TaskName", "TaskDescription", "Hours", "Empnumber"],
        include: [{
            model: db.Employee,
            // 'on' is a Sequelize attribute used to add custom joins because we are not using foreign keys. Below is the syntax for custom joins.
            on: {
                '$Task.Empnumber$': { [Op.eq]: Sequelize.col('employee.Empnumber') },
                [Op.and]: [
                    { '$employee.Email$': { [Op.eq]: UserEmail } },
                    { '$employee.UserId$': { [Op.eq]: UserId } }
                ]
            },
            // The 'attributes' key specifies the columns to be selected from the Employee table (means what table used for join) .
            attributes: ["UserId", "EmpRole", "Email"],
            required: true // This forces an inner join; otherwise, Sequelize defaults to a left outer join.
        }],
        where: { TaskName }
    });

    // We need to use map here because the result instance includes data from both tables.
    const taskEmpDetail = taskDetailInstance.map(instance => instance.get({ plain: true }));

    if(!taskEmpDetail) throw new ApiError(401, "No Task Found");

    let updateTask = {
        TaskName, 
        TaskDescription, 
        Hours : Hrs,
        ModifiedBy : UserId
    }

    let updateTaskStatus = await db.Task.update(updateTask, {
        where : {Empnumber : taskEmpDetail[0].Empnumber}
    });

    if(updateTaskStatus[0] === 1) return res.status(200).json(201, "Task Updated Successfully");
});

module.exports = {
    saveEmpTask,
    updateEmpTask
}
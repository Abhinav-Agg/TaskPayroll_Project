const { Sequelize, DataTypes } = require("sequelize");


const model = (sequelize) => {
    const attributes = {
        EmpId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        FullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Empnumber: {
            type: DataTypes.BIGINT
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        UserId: {
            type: DataTypes.BIGINT,
            references: {
                model: 'Users', // Target model name (replace with your actual model)
                key: 'UserId' // Target model's primary key column (replace if different)
            }
        },
        EmpRole: {
            type: DataTypes.STRING
        },
        ModifiedBy: {
            type: DataTypes.STRING
        },
        IsDeleted: {
            type: DataTypes.TINYINT
        },
        DeletedBy: {
            type: DataTypes.STRING
        },
        IsActive: {
            type: DataTypes.TINYINT
        },
        EmpDepartment: {
            type: DataTypes.STRING,
            allowNull: false
        },
        EmpDesignation: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }

    const options = {
        freezeTableName: true,
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            // Create a unique index on email
            {
                name: 'userId_empnumber_email_index',
                unique: true,
                fields: ['Email', "UserId", "Empnumber"]
            }
        ]
    };

    const Employee = sequelize.define("Employee", attributes, options);

    // By using associations, we inform Sequelize that an Employee can have many entries in another table, which is the Task table in this case.
    // This means a single Employee can be associated with multiple Task entries. This setup allows Sequelize to handle joins correctly even if foreign key constraints are not enforced in the database schema.
    Employee.associate = (models) => {
        Employee.hasMany(models.Task, { foreignKey: 'Empnumber', sourceKey: 'Empnumber' });
    };
    // Here, we define a foreign key in Sequelize, but it does not impact the actual database schema.
    // This association is used for joins and ensures that Sequelize uses the 'Empnumber' column for both tables during insertion and updates.

    return Employee;
}

module.exports = model;
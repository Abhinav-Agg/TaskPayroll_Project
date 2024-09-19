const {Sequelize , DataTypes} = require("sequelize");


const model = (sequelize) => {
    const attributes = {

    }

    const options = {
        freezeTableName: true,
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: true,
        indexes: [
            // Create a unique index on email
            {
              unique: true,
              fields: ['email'],
            }
        ]
    };

    return sequelize.define("Person", attributes, options);
}

module.exports = model;
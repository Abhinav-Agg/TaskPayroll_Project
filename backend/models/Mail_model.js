const { Sequelize, DataTypes } = require("sequelize");


const model = (sequelize) => {
    const attributes = {
        MailId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        Subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        FromAddress: {
            type: DataTypes.BIGINT
        },
        ToAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Body: {
            type: DataTypes.STRING,
            allowNull: false
        },
        IsSent: {
            type: DataTypes.BIGINT
        }
    }

    const options = {
        freezeTableName: true,
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: true,
        createdAt: 'Created_At',
        updatedAt: 'Updated_At',
        indexes: [
            // Create a unique index on email
            {
                name: 'mailId_index',
                unique: true,
                fields: ['MailId']
            }
        ]
    };

    const Mail = sequelize.define("Mail", attributes, options);

    return Mail;
}

module.exports = model;
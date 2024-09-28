const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const secretKey = require("../utils/constants");
const db = require("../db/dbModel");
const { where } = require("sequelize");

const getLoggedInUserDetails = async (req, _, next) => {
    let token = req.headers["authorization"].replace("Bearer ", "") || req.cookies("Accesstoken");

    if (!token) throw new ApiError(400, "UnAuthorized");

    await jwt.verify(token, secretKey, async function (err, decode) {
        if (err) {
            req.TokenError = {
                name: "TokenExpiredError",
                message: "jwt expired"
            }

            return;
        }

        let payloadUserDetailInstance = await db.Users.findOne(
            {
                // By below this we can exclude the fields which we do not requried.
                attributes: { exclude: ['Password', 'RefreshToken', 'created_at', 'updated_at', 'ModifiedAt', 'ModifiedBy', 'DeletedBy'] },
                where: { UserId: decode["userId"] }
            }
        );

        if (!payloadUserDetailInstance) return req.UserNotExistError = "Unauthorized Access";

        let payloadUserRoleInstance = await db.UserRole.findOne(
            {
                attributes: { exclude: ['created_at', 'updated_at'] },
                where: { UserId: decode["userId"] }
            }
        );

        // Get object from sequelize instances.
        // Sequelize Methods returns the instances not object. If we need object we need to use get method with Plain property Syntax used below.
        const objUserDetails = payloadUserDetailInstance.get({ plain: true });
        const objUserRoleDetails = payloadUserRoleInstance.get({ plain: true });

        req.user = { ...objUserDetails, ...objUserRoleDetails };
    });

    next();
}

module.exports = getLoggedInUserDetails;
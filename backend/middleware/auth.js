const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const secretKey = require("../utils/constants");
const db = require("../db/dbModel");
const { where, Op } = require("sequelize");
const { regenerateAccessTokenRefresh } = require("../controllers/user_controller");
const { getRoleId } = require("../utils/CommonMethod");

const getLoggedInUserDetails = async (req, res, next) => {
    let token = req.headers["authorization"].replace("Bearer ", "") || req.cookies("Accesstoken");

    if (!token) throw new ApiError(400, "UnAuthorized");

    await jwt.verify(token, secretKey, async function (err, decode) {
        if (err) {

            req.refreshAccessToken = await regenerateAccessTokenRefresh(req, res);
            if(req.refreshTokenError || req.refreshAccessToken?.statusMessage === "Internal Server Error") return;
        }

        let payloadUserDetailInstance;
        let payloadUserRoleInstance;

        if(decode){
            payloadUserDetailInstance = await db.Users.findOne(
                {
                    // By below this we can exclude the fields which we do not requried.
                    attributes: { exclude: ['Password', 'RefreshToken', 'created_at', 'updated_at', 'ModifiedAt', 'ModifiedBy', 'DeletedBy'] },
                    where: { UserId: decode?.userId }
                }
            );

            payloadUserRoleInstance = await db.UserRole.findOne(
                {
                    attributes: { exclude: ['created_at', 'updated_at' , 'UserRoleId'] },
                    where: { UserId: decode?.userId }
                }
            );
        }
        else{
            payloadUserDetailInstance = await db.Users.findOne(
                {
                    // By below this we can exclude the fields which we do not requried.
                    attributes: { exclude: ['Password', 'RefreshToken', 'created_at', 'updated_at', 'ModifiedAt', 'ModifiedBy', 'DeletedBy'] },
                    where: { UserId: req?.currentUserId }
                }
            );

            payloadUserRoleInstance = await db.UserRole.findOne(
                {
                    attributes: { exclude: ['created_at', 'updated_at', 'UserRoleId'] },
                    where: { UserId: req?.currentUserId }
                }
            );
        }

        if (!payloadUserDetailInstance) return req.UserNotExistError = "Unauthorized Access";

        // Get object from sequelize instances.
        // Sequelize Methods returns the instances not object. If we need object we need to use get method with Plain property Syntax used below.
        const objUserDetails = payloadUserDetailInstance?.get({ plain: true });
        const objUserRoleDetails = payloadUserRoleInstance?.get({ plain: true });

        const roleId = getRoleId(objUserRoleDetails?.Role);

        req.user = { ...objUserDetails, ...objUserRoleDetails, roleId };
    });

    if(req.refreshTokenError || req.refreshAccessToken?.statusMessage === "Internal Server Error") return;
    next();
}

module.exports = getLoggedInUserDetails;
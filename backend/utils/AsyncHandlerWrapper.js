//using higher order function for async handler. By this method not requried to use try catch in every method.
const asyncHandler = (func) => async (req, res, next) => {
    try {
        // basically we pass function in main function and use the parameter of return function beacuse we call the eargument's function inside the return fucntion.
        await func(req, res, next);

    } catch (error) {
        if(!error.statusCode){
            res.status(500).send({
                message : error.message,
                Status : "Failure"
            });
        }
        else{
            res.status(error.statusCode).send({
                message : error.message,
                Status : "Failure"
            });
        }
    }
}

module.exports = asyncHandler;

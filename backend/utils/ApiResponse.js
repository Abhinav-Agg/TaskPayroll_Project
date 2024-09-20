class ApiResponse{
    constructor(statuscode, message="success", data){
        this.statuscode = statuscode,
        this.message = message,
        this.data = data
    }
}

module.export = ApiResponse;
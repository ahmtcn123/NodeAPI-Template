

enum ResponseStatus {
    SUCCESS = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500
}

enum ResponseMessage {
    SUCCESS = "success",
    SYSTEM_ERROR = "system_error",
    INVALID_INPUT = "invalid_input",
}

export { ResponseStatus, ResponseMessage }

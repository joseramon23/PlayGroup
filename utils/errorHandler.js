export const unauthorizedMessage = (message = 'No estas autorizado para hacer esta acción') => {
    return {
        success: false,
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: message
    }
}

export const validationError = (message, statusCode = 400, statusMessage = 'Bad request') => {
    return {
        success: false,
        statusCode: statusCode,
        statusMessage: statusMessage,
        message: message
    }
}

export const errorMessage = (message) => {
    return {
        success: false,
        statusCode: 500,
        statusMessage: 'Error',
        message: message
    }
}

export const unauthorizedMessage = (message = 'No estas autorizado para hacer esta acción') => {
    return {
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: message
    } 
}

export const validationError = (message, statusCode = 400, statusMessage = 'Bad request') => {
    return {
        statusCode: statusCode,
        statusMessage: statusMessage,
        message: message
    }
}

export const errorMessage = (message) => {
    return {
        statusCode: 500,
        statusMessage: 'Error',
        message: message
    }
}

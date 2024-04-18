export const responseSuccessData = (message, statusMessage = 'Accepted', statusCode = 200) => {
    return {
        statusCode: statusCode,
        statusMessage: statusMessage,
        message: message
    }
}

export const responseCreatedData = ( message, data, statusMessage = 'Created', statusCode = 200) => {
    return {
        statusCode: statusCode,
        statusMessage: statusMessage,
        message: message,
        data: data
    }
}

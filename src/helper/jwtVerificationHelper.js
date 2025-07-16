const jsonwebtoken = require('jsonwebtoken')

exports.verify = async (request, secretKey) => {
    let { id, emailId } = await new jsonwebtoken.verify(request.headers.authtoken, secretKey)
    return {
        id, emailId
    }
}
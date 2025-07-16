const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

exports.signup = (req) => {
    let schema = Joi.object({
        firstName: Joi.string().alphanum().min(3).max(30).required(),
        lastName: Joi.string().alphanum().min(3).max(30).required(),
        emailId: Joi.string().email(({ minDomainSegments: 2, tlds: { allow: ['com', 'io'] } })).lowercase().required(),
        password: Joi.string().alphanum().min(8).max(15).required(),
        confirmPassword: Joi.any().valid(Joi.ref('password')).required()
    })
    return schema.validate(req, { abortEarly: false });
}

exports.signin = (req) => {
    let schema = Joi.object({
        emailId: Joi.string().email(({ minDomainSegments: 2, tlds: { allow: ['com', 'io'] } })).lowercase().required(),
        password: Joi.string().alphanum().min(8).max(15).required()
    })
    return schema.validate(req, { abortEarly: false });
}

exports.addProject = (req) => {
    let schema = Joi.object({
        title: Joi.string().min(10).max(50).required(),
        githublink: Joi.string().uri().required(),
        demolink:Joi.string().uri().required(),
        description: Joi.string().min(10).max(10000).required()
    })
    return schema.validate(req, { abortEarly: false });
}
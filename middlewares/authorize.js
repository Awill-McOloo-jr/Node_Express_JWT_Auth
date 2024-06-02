const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()



const authorize = (roles = []) => {
    return (req,res,next) => {
        //Get token from the request header
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1]
        if(!token) {
            return res.status(401).json({Error: "Access token is missing or invalid"})
        }
        //We validate the token if it exists
        const isValid = jwt.verify(token, process.env.Secret)
       

        //Check if there are roles inthe token
        if(roles.length && !roles.includes(isValid.role)){
            return res.status(403).json({Error: "Forbidden"})
        }
        req.user = isValid
        next()
    }

}

module.exports = authorize;
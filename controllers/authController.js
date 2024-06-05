const bcrypt = require('bcrypt')
const employee = require('../models/Employee')
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')




const signup = async  (req,res)=> {
    const {name, email, password,role} = req.body
    if(!name || !email || !password) {
        return res.status(400).json({Error: "All fields are required!"})
    }
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
   
    const newEmployee = {
        name,
        email,
        password: hashedPassword,
        role
    }

    const isExists = await employee.findOne({email})
    if(isExists) {
        return res.status(400).json({message: 'Email already in use.'})
    }
   
    try {
        const Employee = await employee.create(newEmployee)
        const token = jwt.sign({name,email,role}, process.env.Secret)
        res.status(201).json({Employee, token})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
   
}

const login = async (req,res) => {
    const {email, password} = req.body
    if(!email || !password) {
        return res.status(400).json({Error: "All Fields are required!!"})
    }
    const Employee = await employee.findOne({email})
    if(!Employee) {
        return res.status(400).json({Error: 'Invalid Credentials.'})
    }
    const isPasswordValid = await bcrypt.compare(password, Employee.password)
    if(!isPasswordValid) {
        return res.status(400).json({Error: 'Invalid Credentials.'})
    }
    const token = jwt.sign({id:Employee.id ,name: Employee.name, email: Employee.email,role:Employee.role}, process.env.Secret)
    res.status(200).json({message:"logged in Successfully", token})

}






module.exports = {signup,login}
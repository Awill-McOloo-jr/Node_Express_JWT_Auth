const router = require('express').Router()
const { signup, login } = require('../controllers/authController')
const authorize = require('../middlewares/authorize')
const Employee = require('../models/Employee')
const {body} = require('express-validator')
require('dotenv').config()





router.post('/signup',[body('email').isEmail().withMessage('Please Enter a valid Email'),
    body('password').isLength({min:6}).isStrongPassword().withMessage('Password must be STRONG and at least 6 characters')
],signup)

router.post('/login',login)


router.get('/users', authorize(['user']), (req,res) => {
    res.json({message: "You are Authorized to view this page!!"})
})
router.get('/admin',authorize(['admin']), async (req,res) => {
    const employees = await Employee.find()
    res.json({"You are admin, here is a lost of employees, " : employees})
})


module.exports = router;
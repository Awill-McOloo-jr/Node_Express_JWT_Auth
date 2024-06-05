//Import Express app.
const express = require('express')
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const ticketRoutes = require('./routes/Ticketing')
const mongoose = require('mongoose')
require('dotenv').config()
const app = express()



//middlewares
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/products',productRoutes )
app.use('/generate',ticketRoutes)


app.listen(process.env.PORT, () => console.log('App started'))

//Connect to Database
mongoose.connect(process.env.URI).then(console.log('Connected to Database'))






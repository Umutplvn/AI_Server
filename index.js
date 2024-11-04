"use strict"

/*--------------------------------------*
AI APP
/*--------------------------------------*/

const express=require('express')
const app=express()
require('dotenv').config()
const PORT=process.env.PORT
const HOST=process.env.HOST

/*--------------------------------------*/
const session = require("cookie-session")
app.use(session({ secret: process.env.SECRET_KEY || 'secret_keys_for_cookies' }))
app.use(express.json())
app.use(require('cors')())

//! Connect to MongoDB with Mongoose:
require('./src/configs/dbConnection')
/*--------------------------------------*/
// app.use(require('./src/middlewares/authorization'))
/*--------------------------------------*/

// Searching&Sorting&Pagination:
app.use(require('./src/middlewares/findSearchSortPage'))


/*--------------------------------------*/
//! Home Page

app.all('/', (req, res)=>{
    res.send({
        err:false,
        message:'Welcome to Blog APP'
    })
})

/*--------------------------------------*/

//! Routes:
app.use('/api', require('./src/routes/AI'))

/*--------------------------------------*/

//! errorHandler:
app.use(require('./src/errorHandler'))

/*--------------------------------------*/
app.listen(PORT, ()=>console.log(`App is running: ${HOST}:${PORT} `))
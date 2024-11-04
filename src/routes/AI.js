"use strict"
/* -------------------------------------------------------
    EXPRESSJS - BLOG Project with Mongoose
------------------------------------------------------- */

const router = require('express').Router()

const AI = require('../controllers/AI')

// ------------------------------------------
// AI
// ------------------------------------------

router.post('/create', AI.create)


module.exports=router
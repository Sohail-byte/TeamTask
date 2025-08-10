import './utils/loadEnvironment.js'
import './utils/dbConnection.js'
import express from 'express'
import mongoose from 'mongoose'
const app = express()














const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log("Server started successfully")
})
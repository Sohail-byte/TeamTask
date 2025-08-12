import './utils/loadEnvironment.js'
import './utils/dbConnection.js'
import express from 'express'
import mongoose from 'mongoose'
import userRouter from './routes/users.js'
import bodyParser from 'body-parser'
const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('landing-page.ejs')
})

app.use('/', userRouter)










const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log("Server started successfully")
})
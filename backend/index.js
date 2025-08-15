import './utils/loadEnvironment.js'
import './utils/dbConnection.js'
import express from 'express'
import mongoose from 'mongoose'
import userRouter from './routes/users.js'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import isAuthenticated from './utils/middleware/authentication.js'
const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(express.urlencoded())
// app.use(session({
//     secret: process.env.SECRET_KEY,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false }
// }))
app.use(cookieParser())





app.get('/', (req, res) => {
    res.render('landing-page.ejs')
})

app.use(userRouter)

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard.ejs')
})








const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log("Server started successfully")
})
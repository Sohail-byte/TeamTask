import './utils/loadEnvironment.js'
import './utils/dbConnection.js'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import signupRouter from './routes/signup.js'
import loginRouter from './routes/login.js'
import emailAuthenticationRouter from './routes/emailVerification.js'
import dashboardRouter from './routes/dashboard.js'
import notesRouter from './routes/notes.js'
const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(express.urlencoded())
app.use(cookieParser())





app.get('/', (req, res) => {
    res.render('landing-page.ejs')
})

app.use(signupRouter)
app.use(loginRouter)
app.use(emailAuthenticationRouter)
app.use(dashboardRouter)
app.use('/notes', notesRouter)







const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log("Server started successfully")
})
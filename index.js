import './utils/loadEnvironment.js'
import './utils/dbConnection.js'
import {createServer} from 'http'
import { Server } from 'socket.io'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import signupRouter from './routes/signup.js'
import loginRouter from './routes/login.js'
import emailAuthenticationRouter from './routes/emailVerification.js'
import dashboardRouter from './routes/dashboard.js'
import notesRouter from './routes/notes.js'
import collaborationsRouter from './routes/collaborations.js'
import sockethandling from './utils/socketHandler.js'



const app = express()
const server = createServer(app)
const io = new Server(server)

app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(express.urlencoded())
app.use(cookieParser())
app.use(express.static('public'))

//rendering the landing page
//I have used EJS and server side rendering, not because I planned for it,
//but because i didnt know frontend and this seemed easy
app.get('/', (req, res) => {
    res.render('landing-page.ejs')
})

app.use(signupRouter)
app.use(loginRouter)
app.use(emailAuthenticationRouter)
app.use(dashboardRouter)
app.use('/notes', notesRouter)
app.use('/collaborations', collaborationsRouter)
app.use((req, res) => {
  res.status(404).send('404 Not Found')
})


//trying to implement collaboration with the help of websockets

sockethandling(io)









const PORT = process.env.PORT
server.listen(PORT, () => {
    console.log("Server started successfully")
})
const express = require('express')
const cors = require('cors')
const conn = require('./db/conn')
const UserRoutes = require('./routes/UserRoutes')
const User = require('./models/Users')

const app = express()

app.use(express.json())
app.use(cors({ credentials: true, origin: 'http://127.0.0.1:5173'}))

app.use(express.static('public'))

app.use('/users', UserRoutes)

conn.sync().then(()=>{
    app.listen(5000)
}).catch((error)=> console.log(error))



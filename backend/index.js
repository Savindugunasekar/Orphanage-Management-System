const PORT = process.env.PORT || 4000
require('dotenv').config();
const express = require('express')
const app = express()

const { v4: uuid } = require('uuid')

const cors = require('cors')

const fileUpload = require('express-fileupload')

const db = require('./config/dbConn')

const corsOptions = require('./config/corsOptions')
const credentials = require('./middleware/credentials')
const cookieParser = require('cookie-parser')


app.use(credentials)


app.use(cors(corsOptions))


app.use(express.urlencoded({ extended: false }))

app.use(fileUpload())

app.use(express.json())

app.use(cookieParser())



const verifyJWT = require('./middleware/verifyJWT');

app.use('/login', require('./routes/login'))

app.use('/register', require('./routes/register'))

app.use('/refresh', require('./routes/refresh'))

app.use('/logout', require('./routes/logout'));

app.use('/verify', require('./routes/verify'));

app.use('/donate', require('./routes/api/payment'))


app.use(verifyJWT)


app.use('/orphanage', require('./routes/api/orphanages'))

app.use('/socialworker', require('./routes/api/socialworker'))

app.use('/staff', require('./routes/api/staff'))

app.use('/child', require('./routes/api/child'))

app.use('/messages', require('./routes/api/messages'))

app.use('/request', require('./routes/api/request'))

app.use('/file', require('./routes/api/file'))

app.use('/document', require('./routes/api/document'))

app.use('/broadcast', require('./routes/api/broadcast'))

app.use('/application', require('./routes/api/application'))

app.use('/case', require('./routes/api/case'))

app.use('/notifications', require('./routes/api/notifications'))








app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server running on port ${PORT}`);
    }
    else {
        console.log("Error: " + error);
    }
})


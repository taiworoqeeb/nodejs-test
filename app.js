const bodyParser = require('body-parser');
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan')
const mongoose = require('mongoose')
const router = require('./routes/routes');


const DB = process.env.DATABASE;

const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(DB, option)
.then(() => console.log("Database connected!"));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());
app.use(morgan('tiny'))
app.use('/', router)


const port = process.env.PORT || 3000;
app.listen(port, console.log(`connected to http://localhost:${port}`))
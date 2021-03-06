const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const connection = require('./api/config/dbConfig')
const serveIndex = require('serve-index')
const path = require('path');
const serveStatic = require('serve-static')

const userRoutes = require('./api/routes/users');
const adminRoutes = require('./api/routes/admin');

app.use(morgan('dev'));

// app.use(express.static(__dirname + '/uploads'));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({limit:'50mb'}));


connection.connect()

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
})

/**for files */
app.use(serveStatic(path.join(__dirname, 'uploads')));
/**for directory */
app.use('/uploads', express.static('uploads'), serveIndex('uploads'))

app.use('/user', userRoutes);
app.use('/admin', adminRoutes)

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const connection = require('../config/dbConfig')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth : {
        user: 'rohanmehrotra83@gmail.com',
        pass: 'rohansimran'
    }
})

const mailOptions = {
    from : 'no-reply@gmail.com',
    subject: 'Rites registration userid and password'
}

exports.user_signup = (req, res, next) => {
    const user_id = crypto.randomBytes(4).toString('hex');
    const password = crypto.randomBytes(4).toString('hex');
    bcrypt.hash(password, 5, (err, hash) => {
        if(err) {
            return res.status(500).json({
                error: err
            });
        } else {
            var sql = `insert into user(user_id,name,email,password) values('${user_id}','${req.body.name}','${req.body.email}','${hash}')`
            new Promise((resolve, reject) => {
                connection.query(sql, function(error, results, fields) {
                    if(error) {
                        reject(error)
                    } 
                    resolve(results)
                })
            })
            .then(result => {
                mailOptions['to'] = req.body.email;
                mailOptions['html'] = `<p>UserId: ${user_id} <br />Password: ${password}`
                transporter.sendMail(mailOptions, function (err, info) {
                    if(err)
                        throw err
                    else {
                        return result
                    }    
                })
                
            })
            .then(result => {
                return res.status(200).json({
                    message: {
                        name: req.body.name,
                        email: req.body.email,
                        user_id: user_id
                    }
                })
            })
            .catch(err => {
                return res.status(500).json({
                    message: err
                })
            })
        }
    })
}

exports.user_login = (req, res, next) => {
    var sql = `select * from user where user_id="${req.body.user_id}"`
    new Promise((resolve, reject) => {
        connection.query(sql, function(error, results, fields) {
            if(error)
                reject(error)
            else {
                console.log(results);
                resolve(results);
            }    
        })
    })
    .then(user => {
        if(user.length < 0){
            return res.status(401).json({
                message: "User not found"
            })
        }
        bcrypt.compare(req.body.password,user[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: "Auth failed"
                })
            }
            if(result) {
                const token = jwt.sign({
                    email: user[0].email,
                    user_id: user[0].user_id
                }, 'secret', { expiresIn: "1h" })

                return res.status(200).json({
                    message: "Auth Successfull",
                    token: token
                })
            }
            res.status(401).json({
                message: "Auth failed"
            });
        })
    })
    .catch(err => {
        return res.status(400).json({
            message: "Auth failed"
        })
    })
}

exports.user_delete = (req, res, next) => {
    
}
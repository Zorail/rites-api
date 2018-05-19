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
    to: 'rohan.seth497@gmail.com',
    subject: 'Rites registration userid and password',
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
                mailOptions['html'] = `<p>UserId: ${user_id} <br />Password: ${password}`
                console.log(mailOptions)
                transporter.sendMail(mailOptions, function (err, info) {
                    if(err)
                        throw err
                    else {
                        console.log(info)
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

}

exports.user_delete = (req, res, next) => {
    
}
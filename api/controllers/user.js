const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const pdf = require('html-pdf');
const fs = require('fs');

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

function getHtml(user) {
    var html = `
    <html>
        <body>
            <p>User Id: ${user.user_id}</p><br />
            <p>Email: '${user.email}'</p><br />
            <p>Name: '${user.name}'</p><br />
            <p>Father's Name: '${user.father_name}'</p><br />
            <p>Date Of Birth: '${user.dob}'</p><br />
            <p>Category: '${user.category}'</p><br />
            <p>Gender: '${user.gender}'</p><br />
            <p>Vacancy Number applied for: '${user.vacancy_no}'</p><br />
            <p>Post Applied For: '${user.post_applied}'</p><br />
            <p>Address1: '${user.address1}'</p><br />
            <p>Address2: '${user.address2}'</p><br />
            <p>Qualification: '${user.qualification}'</p><br />
            <p>Experience: '${user.experience}'</p><br />
        </body>
    </html>
    `
    return html;
}


exports.user_signup = (req, res, next) => {
    const user_id = crypto.randomBytes(4).toString('hex');
    const password = crypto.randomBytes(4).toString('hex');
    console.log(password);
    const dob = new Date(req.body.dob).toISOString().slice(0, 19).replace('T', ' ').split(" ")[0];
    bcrypt.hash(password, 5, (err, hash) => {
        if(err) {
            return res.status(500).json({
                error: err
            });
        } else {
            var sql = `insert into user(user_id,name,email,password,father_name,dob,category,gender,vacancy_no,post_applied) 
            values('${user_id}','${req.body.name}','${req.body.email}','${hash}','${req.body.father_name}','${dob}','${req.body.category}','${req.body.gender}','${req.body.vacancy_no}','${req.body.post_applied}')`
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
                // console.log(results);
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

exports.user_update = (req, res, next) => {
    const user_id = req.params.userId
    // console.log(req.files);
    var sql = `update user set address1='${req.body.address1}',address2='${req.body.address2}',qualification='${req.body.qualification}',experience='${req.body.experience}',photo_uri='${req.files[0].path}',signature_uri='${req.files[1].path}' where user_id='${user_id}'`;
    new Promise((resolve, reject) => {
        connection.query(sql, function(error, results, fields) {
            if(error) {
                reject(error)
            }
            resolve(results)
        })
    })
    .then(result => {
        const sql = `select * from user where user_id='${user_id}'`
        connection.query(sql, function(error, results, fields) {
            if(error){
                throw error
            } else {
                pdf.create(getHtml(results[0])).toFile('./uploads/biodata/temp', function(err, res) {
                    console.log(res);
                })
            }
        })
    })
    .then(result => {
        res.status(201).json({
            message: "Record Updated"
        })
    })
    .catch(err => {
        res.status(401).json({
            error: err
        })
    })
}

exports.user_delete = (req, res, next) => {
    
}
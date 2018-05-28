const connection = require('../config/dbConfig')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.get_vacancies = (req, res, next) => {
    var sql = `select * from vacancy_master`;
    new Promise((resolve, reject) => {
        connection.query(sql, function(error, results, fields) {
            if(error) {
                reject(error)
            }
            resolve(results)
        })
    })
    .then(vacancies => {
        res.status(201).json({
            vacancies: vacancies
        })
    })
    .catch(err => {
        res.status(400).json({
            error: err
        })
    })
}

exports.get_vacancies_with_user = (req, res, next) => {
    var sql = `select user.*,vacancy_master.vacancy_name from user inner join vacancy_master on user.vacancy_no = vacancy_master.vacancy_no`
    new Promise((resolve, reject) => {
        connection.query(sql, function(error , results, fields) {
            if(error){
                reject(error)
            }
            const data = results.map(user => user.vacancy_no);
            const set1 = new Set(data);
            const arr = Array.from(set1);
            const demo = arr.map(vacancy_no => results.filter(user => user.vacancy_no == vacancy_no));
            resolve(demo);
        })
    })
    .then(users => {
        res.status(200).json({
            users: users
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}


exports.vacancy_upload = (req, res, next) => {
    var vacancy = req.body
    vacancy['opening_date'] = new Date(vacancy.opening_date).toISOString().slice(0, 19).replace('T', ' ');
    vacancy['closing_date'] = new Date(vacancy.closing_date).toISOString().slice(0, 19).replace('T', ' ');
    vacancy['registration_close'] = new Date(vacancy.registration_close).toISOString().slice(0, 19).replace('T', ' ');
    vacancy['cut_off'] = new Date(vacancy.cut_off).toISOString().slice(0, 19).replace('T', ' ');
    var sql = `insert into vacancy_master(vacancy_name,vacancy_no,applicable_for,opening_date,closing_date,registration_closing_date,cut_off,maxAge,minAge,uploaded_uri) values('${vacancy.vacancy_no}','${vacancy.vacancy_name}','${vacancy.applicable_for}','${vacancy.opening_date}','${vacancy.closing_date}','${vacancy.registration_close}','${vacancy.cut_off}','${vacancy.maxAge}','${vacancy.minAge}','${vacancy.uploaded_uri}')`
    new Promise((resolve, reject) => {
        connection.query(sql, function(error, results, fields) {
            if(error){
                reject(error)
            }
            resolve(results);
        })
    })
    .then(vacancy => {
        return res.status(200).json({
            vacancy: vacancy
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

exports.login_admin = (req, res, next) => {
    var email = req.body.email
    var password = req.body.password
    var pass_hash = '$2b$05$NbGCMh5nl4ah33.0DaZREOOjI.knWSq8YNXBuU3aeHo8i6GPXITC2'
    new Promise((resolve, reject) => {
        bcrypt.compare(password, pass_hash, (err, result) => {
            if(err) {
                return res.status(401).json({
                    error: err
                })
            }
            if(result) {
                const token = jwt.sign({
                    email: email,
                    type: 'amdin'
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
}


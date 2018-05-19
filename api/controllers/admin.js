const connection = require('../config/dbConfig')

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
            resolve(results);
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


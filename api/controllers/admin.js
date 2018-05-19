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


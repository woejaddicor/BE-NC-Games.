const db = require('../db/connection');

exports.fetchUsers = () => {
   return db.query(`SELECT username FROM users;`).then((results) => {   
        return results.rows;
   })
}

exports.fetchUserByUsername = (username) => {
    const regex = /[A-Z, a-z]/g

    if (!regex.test(username.username)){
        return Promise.reject({
            status: 400,
            msg: `Invalid username type` 
    })

    }
    return db.query(`SELECT * FROM users WHERE username = $1;`, [username.username]).then((result) => {
        const username = result.rows[0];
        if (username === undefined){
            return Promise.reject({
                status: 404,
                msg: `username: ${username} not found`
            })
        }
        return username;
    })
}
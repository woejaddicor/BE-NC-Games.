const db = require('../db/connection');

exports.fetchComments = () => {
    return db.query(`SELECT * FROM comments;`).then((results) => {
        console.log(results.rows);
        return results.rows;
    })
}
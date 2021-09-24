const db = require('../db/connection');

exports.fetchComments = (review_id) => {
    return db.query(`SELECT * FROM comments WHERE review_id = $1;`, [review_id]).then((results) => {
        return results.rows;
    })
}
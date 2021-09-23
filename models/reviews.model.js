const db = require('../db/connection');

exports.fetchReview = (review_id) => {
    return db.query(`SELECT reviews.*, COUNT(comment_id) AS comment_count FROM reviews
    FULL OUTER JOIN comments ON reviews.review_id = comments.review_id 
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;`, [review_id]).then((result) => {
        return result.rows;
    })
}

exports.reviewUpdater = (newVotes, voteToUpdate) => {
    return db.query(`UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING*;`, [newVotes, voteToUpdate]).then((results) => {
        return results.rows;
    })
}

exports.fetchAllReviews = (sort_by) => {
    return db.query(`SELECT reviews.*, COUNT(comment_id) AS comment_count FROM reviews FULL OUTER JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY $1 ASC;`, [sort_by]).then((results) => {
        return results.rows;
    })
}
const { query } = require('../db/connection');
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

exports.fetchAllReviews = (sort_by = 'created_at', order = 'desc', category) => {
   
    let queryStr = `SELECT reviews.*, COUNT(comment_id) AS comment_count FROM reviews FULL OUTER JOIN comments ON reviews.review_id = comments.review_id`;

    if (category) {
        queryStr += ` WHERE reviews.category = '${category}'`
    }
    
    if (sort_by, order) {
        queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order}`;
    }

    return db.query(queryStr).then((results) => {
        return results.rows;
    })
}

exports.fetchReviewIdComments = (review_id) => {
   return db.query(`SELECT comments.* FROM reviews
   FULL OUTER JOIN comments
   ON reviews.review_id = comments.review_id
   WHERE reviews.review_id = $1
   GROUP BY comments.comment_id
   ORDER BY comments.review_id;`, [review_id]).then((results) => {
        return results.rows;
   })
}

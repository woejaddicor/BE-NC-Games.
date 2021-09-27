const { query } = require('../db/connection');
const db = require('../db/connection');

exports.fetchReview = (review_id) => {
    return db.query(`SELECT reviews.*, COUNT(comment_id) AS comment_count FROM reviews
    FULL OUTER JOIN comments ON reviews.review_id = comments.review_id 
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;`, [review_id]).then((result) => {
        const review = result.rows;
        if (review.length === 0) {
            return Promise.reject({
                status: 404,
                msg: `No review found for review_id: ${review_id}`,
            });
        }
        return review;
    })
}

exports.reviewUpdater = (newVotes, voteToUpdate) => {
    return db.query(`UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING*;`, [newVotes, voteToUpdate]).then((results) => {
        const review = results.rows;
        console.log(review);
        if (review.length === 0) {
            return Promise.reject({
                status: 404,
                msg: `No review found for review_id: ${voteToUpdate}`,
            });
        }
        return review;
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

// exports.postComment = (newComment) => {
//     // const newCommentArray = [
//     //     newComment.author,
//     //     newComment.body
//     // ]

//     return db.query(`INSERT INTO comments (author, body) VALUES (${newComment.author}, ${newComment.body}) RETURNING*;`, newCommentArray).then((results) => {
//         console.log(results.rows);
//         // return results.rows[0];
//     })
// }
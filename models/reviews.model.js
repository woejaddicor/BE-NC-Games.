const { getReviewIdComments } = require('../controllers/reviews.controller');
const { query } = require('../db/connection');
const db = require('../db/connection');

exports.fetchReview = (review_id) => {
    return db.query(`SELECT reviews.*, COUNT(comment_id) AS comment_count FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id 
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
    if (typeof newVotes !== 'number'){
        return Promise.reject({
            status: 400,
            msg: 'Bad Request'
        })
    } else {
        return db.query(`UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING*;`, [newVotes, voteToUpdate]).then((results) => {
            const review = results.rows;
            if (review.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `No review found for review_id: ${voteToUpdate}`,
                });
            }
            return review;
        })
    }
}

exports.fetchAllReviews = (sort_by = 'created_at', order = 'desc', category) => {
    
    const validColumns = ['review_id', 'title', 'review_body', 'designer', 'review_img_url', 'votes', 'category', 'owner', 'created_at'];

    const validOrders = ['asc', 'desc', 'ASC', 'DESC']

    const validCategories = ['strategy', 'dexterity', 'hidden-roles', 'push-your-luck', 'deck-building', 'engine-building', 'roll-and-write', 'social_deduction'];
    
        if (order !== null && !validOrders.includes(order)){
            return Promise.reject({
                status: 400,
                msg: 'Invalid sort order',
            });
        }

    if (sort_by != null && !validColumns.includes(sort_by) && order) {
        return Promise.reject({
            status: 400,
            msg: `sort_by: ${sort_by} is invalid`, 
        })
    }

    if(category != null && !validCategories.includes(category)) {
        return Promise.reject({
            status: 400,
            msg: `category: ${category} is invalid`,
        })
    }

    let queryStr = `SELECT reviews.*, COUNT(comment_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id`;

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
        const reviewIdComments = results.rows;
        if (reviewIdComments.length === 0) {
            return Promise.reject({
                status: 404,
                msg: `review_id: ${review_id} is invalid`,
            })
        }
        return reviewIdComments;
   })
}

exports.postComment = (newComment) => {
    const newCommentArray = [
        newComment.author,
        newComment.body
    ];

    return db.query(`INSERT INTO comments (comment_id, author, review_id, votes, created_at,  body) 
    INNER JOIN comments ON reviews.review_id = comments.review_id
    RETURNING*;`, newCommentArray).then((results) => {
        return results.rows[0];
    })
}


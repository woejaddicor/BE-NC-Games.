const db = require('../db/connection');

exports.fetchComments = (review_id) => {
    return db.query(`SELECT * FROM comments WHERE review_id = $1;`, [review_id]).then((results) => {
        return results.rows;
    })
}

exports.patchCommentBbyId = (voteUpdate, commentToUpdate) => {
    if (typeof voteUpdate.inc_votes !== 'number') {
        return Promise.reject({
            status: 400,
            msg: 'Invalid request'
        })
    }
    
    return db.query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING*;`, [voteUpdate.inc_votes, commentToUpdate.comment_id]).then((results) => {
        const updatedComment = results.rows;
        if (updatedComment.length === 0){
            return Promise.reject({
                status: 404,
                msg: `comment_id: ${commentToUpdate.comment_id} is not found`
            })
        }
        return updatedComment;        
    })
}
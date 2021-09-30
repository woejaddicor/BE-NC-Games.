const db = require('../db/connection');

exports.fetchComments = () => {
    return db.query(`SELECT * FROM comments;`).then((results) => {
        return results.rows;
    })
}

exports.removeCommentById = (commentId) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING*;`, [commentId.comment_id]).then((results) => {
       const deletedComment = results.rows[0];
       if (deletedComment === undefined) {
           return Promise.reject({
               status: 404,
               msg: `comment_id: ${commentId.comment_id} not found`
           })
       }
       return deletedComment;
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
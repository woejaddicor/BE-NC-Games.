\c nc_games;

-- SELECT * FROM categories;
-- SELECT * FROM users;
-- SELECT * FROM reviews;
-- SELECT * FROM comments;

-- SELECT reviews.*, COUNT(comment_id) AS comment_count FROM reviews
-- FULL OUTER JOIN comments ON reviews.review_id = comments.review_id 
-- WHERE reviews.review_id = 1
-- GROUP BY reviews.review_id;

-- SELECT reviews.*, COUNT(comment_id)
-- AS comment_count FROM reviews
-- FULL OUTER JOIN comments
-- ON reviews.review_id = comments.review_id
-- WHERE reviews.category = 'strategy'
-- GROUP BY reviews.review_id
-- ORDER BY votes ASC;

-- SELECT comments.* FROM reviews
-- FULL OUTER JOIN comments
-- ON reviews.review_id = comments.review_id
-- WHERE reviews.review_id = '1'
-- GROUP BY comments.comment_id
-- ORDER BY comments.review_id ASC;

-- INSERT INTO comments (author, body)
-- VALUES ('hey', 'there')
-- WHERE review_id = 2
-- RETURNING*;

-- SELECT * FROM comments

-- UPDATE comments
-- SET votes = votes + -10
-- WHERE comment_id = 2
-- RETURNING*;

DELETE FROM comments
WHERE comment_id = 2
RETURNING*;
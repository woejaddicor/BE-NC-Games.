\c nc_games;

-- SELECT * FROM categories;
-- SELECT * FROM users;
-- SELECT * FROM reviews;
-- - SELECT * FROM comments;

-- SELECT reviews.*, COUNT(comment_id) AS comment_count FROM reviews
-- FULL OUTER JOIN comments ON reviews.review_id = comments.review_id 
-- WHERE reviews.review_id = 1
-- GROUP BY reviews.review_id;

SELECT reviews.*, COUNT(comment_id)
AS comment_count FROM reviews
FULL OUTER JOIN comments
ON reviews.review_id = comments.review_id
GROUP BY reviews.review_id
ORDER BY title ASC;
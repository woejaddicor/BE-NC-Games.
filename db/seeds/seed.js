const db = require('../connection')
const format = require('pg-format');
const {dataFormat} = require('../utils/data-manipulation');

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  return db
  .query(`DROP TABLE IF EXISTS comments;`)
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS reviews;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`)
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS categories;`)
      })
    })
    .then(() => {
      return db.query
      (`CREATE TABLE categories (
        slug VARCHAR(1000) PRIMARY KEY,
        description VARCHAR(1000) NOT NULL
      );
      `);
    })
    .then(() => {
      return db.query
      (`CREATE TABLE users (
        username VARCHAR(1000) PRIMARY KEY,
        avatar_url VARCHAR(1000),
        name VARCHAR(100) NOT NULL
      );
      `);
    })
    .then(() => {
      return db.query
      (`CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        title VARCHAR(1000) NOT NULL,
        review_body TEXT NOT NULL,
        designer VARCHAR(1000),
        review_img_url VARCHAR(1000) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
        votes INT DEFAULT 0,
        category VARCHAR(1000) REFERENCES categories(slug),
        owner VARCHAR(1000) REFERENCES users(username),
        created_at TIMESTAMP DEFAULT NOW()
      );
      `)
    })
    .then(() => {
      return db.query
      (`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(1000) REFERENCES users(username),
        review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE,
        votes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        body TEXT
      );
      `)
    })
  })
  .then(() => {
     const formattedCategories = dataFormat(categoryData, ['slug', 'description'])
     
       const queryStr = format(`INSERT INTO categories (slug, description) VALUES %L RETURNING*;`, formattedCategories)
       return db.query(queryStr);
  })
  .then(() => {
    const formattedUsers = dataFormat(userData, ['username', 'avatar_url', 'name'])

    const queryStr2 = format(`INSERT INTO users (username, avatar_url, name) VALUES %L RETURNING *;`, formattedUsers)
    return db.query(queryStr2);
  })
  .then(() => {
    const formattedReviews = dataFormat(reviewData, ['title', 'review_body', 'designer', 'review_img_url', 'votes', 'category', 'owner', 'created_at'])

    const queryStr3 = format(`INSERT INTO reviews (title, review_body, designer, review_img_url, votes, category, owner, created_at) VALUES %L RETURNING *;`, formattedReviews)
    return db.query(queryStr3);
  })
  .then(() => {
    const formattedComments = dataFormat(commentData, ['author', 'review_id', 'votes', 'created_at', 'body'])

    const queryStr4 = format(`INSERT INTO comments (author, review_id, votes, created_at, body) VALUES %L RETURNING*;`, formattedComments)
    return db.query(queryStr4);
  })
};

module.exports = seed;

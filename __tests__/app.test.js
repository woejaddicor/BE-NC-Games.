const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const  seed  = require('../db/seeds/seed.js');
const express = require('express');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('#get/api/categories', () => {
    test('Should return 200 and all categories', () => {
      return request(app)
        .get('/api/categories')
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body.categories)).toBe(true);
          expect(res.body.categories.length).toBe(4);
          res.body.categories.forEach((category) => {
            expect(Object.keys(category)).not.toHaveLength(0)
              expect(category).toMatchObject({
                  slug: expect.any(String),
                  description: expect.any(String)
              })
          })
        });
    });
  });

  describe('#get/api/reviews/review_id', () => {
      test('Should return 200 and a review object', () => {
        return request(app)
        .get('/api/reviews/2')
        .expect(200)
        .then((res) => {
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.review[0].review_id).toBe(2)
            expect(res.body.review[0]).toMatchObject({
                   owner: expect.any(String),
                   title: expect.any(String),
                   review_id: expect.any(Number),
                   category: expect.any(String),
                   review_img_url: expect.any(String),
                   created_at: expect.any(String),
                   votes: expect.any(Number),
                   comment_count: expect.any(String)
            })
        })
    })
    test("Should return 400 and bad request if sent an invalid id", () => {
        return request(app)
          .get("/api/reviews/nope")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Bad Request");
          });
      });
      test('Should return 404 custom error if id is in valid format but non-existent', () => {
          return request(app)
          .get('/api/reviews/55554')
          .expect(404)
          .then((res) => {
              expect(res.body.msg).toBe('No review found for review_id: 55554')
          })
      })
})

describe('#patch/api/reviews/:review_id', () => {
    test('Should return a 200 with a message of accepted and also return updated item', () => {
      const newVotes = {inc_votes: 10}
        return request(app)
        .patch('/api/reviews/4')
        .send(newVotes)
        .expect(200)
        .then((res) => {
            expect(res.body.msg).toBe('Accepted');
            expect(res.body.vote[0].votes).toBe(17);
        })
    })
    test("Should return 400 and bad request if sent an invalid id to update", () => {
        return request(app)
          .patch('/api/reviews/invalid')
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe('Bad Request');
          });
      });
      test('Should return 404 custom error if id is in valid format but non-existent', () => {
        const newVotes = {inc_votes: 55} 
        return request(app)
        .patch('/api/reviews/2000')
        .send(newVotes)
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('No review found for review_id: 2000')
        })
    })
    test('Should return 400 if request body is incorrect', () => {
        const newVotes = {inc_votes: '55'}
        return request(app)
        .patch('/api/reviews/4')
        .send(newVotes)
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Bad Request')
        })
    })
    test('should return 400 if request body is missing', () => {
        const newVotes = {inc_votes: null }
        return request(app)
        .patch('/api/reviews/4')
        .send(newVotes)
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Bad Request')
        }) 
    })
})

describe('#get/api/reviews', () => {
    test('Should return 200 and all reviews', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then((res) => {
            res.body.reviews.forEach((review) => {
                expect(Object.keys(review)).not.toHaveLength(0)
                expect(review).toMatchObject({
                    owner: expect.any(String),
                    title: expect.any(String),
                    review_id: expect.any(Number),
                    category: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String) 
                })
            })
        })
    })
    test('Should return 200 and all reviews sorted by unique query', () => {
        return request(app)
        .get('/api/reviews?sort_by=votes')
        .expect(200)
        .then((res) => {
            expect(res.body.reviews).toBeSortedBy('votes', {descending: true})
        })  
    })
    test('Should return 400 and bad request if sent a sort_by value that is not allowed', () => {
        return request(app)
          .get('/api/reviews?sort_by=chips')
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe('sort_by: chips is invalid');
          });
      })
    test('Should return 200 and all reviews sorted in custom order asc or desc', () => {
        return request(app)
        .get('/api/reviews?order=DESC')
        .expect(200)
        .then((res) => {
            expect(res.body.reviews).toBeSortedBy('created_at', {descending: true})
        })
    })
    test('Should return 200 error if incorrect order is entered', () => {
        return request(app)
        .get('/api/reviews?order=bananas')
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Invalid sort order');
        })
    })
    test('Should return reviews filtered by specified query category', () => {
        return request(app)
        .get('/api/reviews?category=social_deduction')
        .expect(200)
        .then((res) => {
            res.body.reviews.forEach((review) => {
                expect(review.category).toBe('social deduction');
            })
        })
    })
    test('Should return error 400 if category entered does not exist', () => {
        return request(app)
        .get('/api/reviews?category=invalid')
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('category: invalid is invalid')
        })
    })
})

describe('#get/api/comments', () => {
    test('Should respond with an array of all comments', () => {
        return request(app)
        .get('/api/comments')
        .expect(200)
        .then((res) => {
            res.body.comments.forEach((comment) => {
                expect(Object.keys(comment)).not.toHaveLength(0);
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    author: expect.any(String),
                    review_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    body: expect.any(String)
                })
            })
        })
    })
})

describe('#get/api/reviews/:review_id/comments', () => {
    test('Should respond with an array of comments for a given user id', () => {
        return request(app)
        .get('/api/reviews/3/comments')
        .expect(200)
        .then((res) => {
            expect(res.body.comments).toHaveLength(3);
            res.body.comments.forEach((comment) => {
                expect(Object.keys(comment)).not.toHaveLength(0)
                expect(comment.review_id).toBe(3)
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String)
                })
            })     
        })
    })
    test('Should return 400 error if invalid user_id', () => {
        return request(app)
        .get('/api/reviews/invalid/comments')
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Bad Request')
        })
    })
    test('Should return 404 custom error if id is in valid format but non-existent', () => {
        return request(app)
        .get('/api/reviews/55554/comments')
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('review_id: 55554 is invalid');
        })
    })
})

describe('#post/api/reviews/:review_id/comments', () => {
    test('Should post a new comment for a given user and return that posted comment', () => {
        const newComment = {username: 'bainesface', body: 'hey'} 
        return request(app)
        .post('/api/reviews/2/comments')
        .send(newComment)
        .expect(201)
        .then((res) => {
            expect(res.body.comment).toMatchObject({
                comment_id: expect.any(Number),
                author: expect.any(String),
                votes: expect.any(Number),
                review_id: expect.any(Number),
                created_at: expect.any(String),
                body: expect.any(String)
            })
        })
    })
    test('Should return error 400 if an invalid id is entered', () => {
        const newComment = {username: 'bainesface', body: 'hey'} 
        return request(app)
        .post('/api/reviews/invalid/comments')
        .send(newComment)
        .expect(400)
        .then((res) => { 
            expect(res.body.msg).toBe('Bad Request')
        })
    })
    test('Should return 404 error if valid id type is entered but id does not exist', () => {
        const newComment = {username: 'bainesface', body: 'hey'} 
        return request(app)
        .post('/api/reviews/2000/comments')
        .send(newComment)
        .expect(404)
        .then((res) => { 
            expect(res.body.msg).toBe('Bad Request')
        }) 
    })
    test('Post requests with missing request body should return error 400', () => {
        const newComment = {username: null}
        return request(app)
        .post('/api/reviews/4/comments')
        .send(newComment)
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Invalid request body')
        })
    })
    test('Post request with incorrect type request body should return 400 error', () => {
        const newComment = {username: 55, body: false}
        return request(app)
        .post('/api/reviews/4/comments')
        .send(newComment)
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Invalid request body')
        }) 
    })
    test('Should respond with 404 error if request body username does not exist', () => {
        const newComment = {username: 'Gary', body: 'I am trying to disrupt the data'}
        return request(app)
        .post('/api/reviews/5/comments')
        .send(newComment)
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('Bad Request')
        })
    })
})

describe('#get/api', () => {
    test('Should respond with 200 and a JSON with all the available endpoints in the DB', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((res) => {
           
        })
    })
})

describe('#delete/api/comments/:comment_id', () => {
    test('Should respond with 204 status and deletes the given comment from the database', () => {
        return request(app)
        .delete('/api/comments/2')
        .expect(204)
        .then((res) => {
            expect(Object.keys(res.body)).toHaveLength(0)
        })
    })
    test('Should return error 400 if an invalid id type is entered to be deleted', () => {
        return request(app)
        .delete('/api/comments/dog')
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Bad Request');
        })
    })
    test('Should respond with error 404 if id to be deleted is correct format but not present in db', () => {
        return request(app)
        .delete('/api/comments/2000')
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('comment_id: 2000 not found')
        })
    })
})


describe('#get/api/users', () => {
    test('Should respond with 200 and an array of objects with username property', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((res) => {
            expect(res.body.users).toHaveLength(4);
            res.body.users.forEach((user) => {
                expect(Object.keys(user)).not.toHaveLength(0);
                expect(user).toMatchObject({
                    username: expect.any(String)
                })
            })
        })
    })
})

describe('#get/api/users/:username', () => {
    test('Should respond with a 200 and a user object for the given username', () => {
        return request(app)
        .get('/api/users/bainesface')
        .expect(200)
        .then((res) => {
            expect(res.body.users.username).toBe('bainesface');
            expect(res.body.users).toMatchObject({
                username: expect.any(String),
                avatar_url: expect.any(String),
                name: expect.any(String)
            })
        })
    })
    test('Should respond with a 400 error if request contains invalid type of username', () => {
        return request(app)
        .get('/api/users/999')
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Invalid username type');
        })
    })
    test('Should respond with a 404 if valid username type but not within database', () => {
        return request(app)
        .get('/api/users/dogface')
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('username: undefined not found')
        })
    })
})

describe('#patch/api/comments/:comment_id', () => {
    test('Should return 200 and a comment object, updated to increase the vote count', () => {
        const newVotes = {inc_votes: 10}
        return request(app)
        .patch('/api/comments/1')
        .expect(200)
        .send(newVotes)
        .then((res) => {
            expect(res.body.comment[0].votes).toBe(26);
        })
    })
    test('Should return 200 and a comment object, updated to decrease the vote count', () => {
        const newVotes = {inc_votes: -50}
        return request(app)
        .patch('/api/comments/2')
        .expect(200)
        .send(newVotes)
        .then((res) => {
            expect(res.body.comment[0].votes).toBe(-37);
        })
    })
    test('Should return a 400 error if an invalid type of comment_id is entered', () => {
        const newVotes = {inc_votes: -50}
        return request(app)
        .patch('/api/comments/notAnId')
        .expect(400)
        .send(newVotes)
        .then((res) => {
            expect(res.body.msg).toBe('Bad Request'); 
        })
    })
    test('Should return 404 error if id type is valid but not found within the db', () => {
        const newVotes = {inc_votes: -50}
        return request(app)
        .patch('/api/comments/9000')
        .expect(404)
        .send(newVotes)
        .then((res) => {
            expect(res.body.msg).toBe('comment_id: 9000 is not found')
        }) 
    })
    test('Should return 400 error if the request body is in  incorrect type', () => {
        const newVotes = {inc_votes: 'invalid'}
        return request(app)
        .patch('/api/comments/3')
        .expect(400)
        .send(newVotes)
        .then((res) => {
            expect(res.body.msg).toBe('Invalid request')
        })  
    })
    test('Should return 400 error if the request body is missing', () => {
        const newVotes = {inc_votes: null}
        return request(app)
        .patch('/api/comments/3')
        .expect(400)
        .send(newVotes)
        .then((res) => {
            expect(res.body.msg).toBe('Invalid request')
        })  
    })
})

describe('ANY/ Invalid URL', () => {
    test('404: non existent, invalid URL', () => {
        return request(app)
        .get('/invalid_url')
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('Invalid URL');
        })
    })
})
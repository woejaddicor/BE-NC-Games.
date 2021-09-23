const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const  seed  = require('../db/seeds/seed.js');

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
        .get('/api/reviews/1')
        .expect(200)
        .then((res) => {
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.review[0].review_id).toBe(1)
            expect(res.body.review[0]).toMatchObject({
                   owner: expect.any(String),
                   title: expect.any(String),
                   review_id: expect.any(Number),
                   category: expect.any(String),
                   review_img_url: expect.any(String),
                   created_at: expect.any(String),
                   votes: expect.any(String),
                   comment_count: expect.any(String)
            })
        })
    })
})

describe('#patch/api/reviews/:review_id', () => {
    test('Should return a 202 with a message of accepted and also return updated item', () => {
      const newVotes = {inc_votes: 10}
        return request(app)
        .patch('/api/reviews/4')
        .send(newVotes)
        .expect(202)
        .then((res) => {
            expect(res.body.msg).toBe('Accepted');
            expect(res.body.vote[0].votes).toBe('17');
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
                expect(review).toMatchObject({
                    owner: expect.any(String),
                    title: expect.any(String),
                    review_id: expect.any(Number),
                    category: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(String),
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
            console.log(res.body.reviews);
            expect(res.body.reviews).toBeSortedBy('votes')
        })  
    })
})

// expect(res.body.reviews[0].votes).toBeLessThanOrEqual(
//     res.body.reviews[5].votes
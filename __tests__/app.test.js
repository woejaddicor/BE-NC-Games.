const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const  seed  = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('testing seed', () => {
    test('users table should display', () => {
        return request(app)
        .get('/api/categories')
        .then((res) => {
        
        })
    });
});

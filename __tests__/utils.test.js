const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const  seed  = require('../db/seeds/seed.js');
const {dataFormat} = require('../db/utils/data-manipulation');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('dataFormat', () => {
    test('input an empty array, return an empty array', () => {
        const actual = dataFormat([]);
        const expected = [];
        expect(actual).toEqual(expected);
    });
    test('Input data with single key, return value from that key', () => {
        const data = [{name: 'Joe'}];
        const keys = ['name'];
        const actual = dataFormat(data, keys);
        const expected = [['Joe']]
        expect(actual).toEqual(expected);
    });
    test('Input data with multiple keys, return multiple values', () => {
        const data = [{name: 'Joe', age: 27}];
        const keys = ['name', 'age'];
        const actual = dataFormat(data, keys);
        const expected = [['Joe', 27]];
        expect(actual).toEqual(expected);
    });
    test('Input data with more than one obj, return keys for all', () => {
        const data = [{name: 'Joe', age: 27, occupation: 'developer'},
                      {name: 'Mike', age: 30, occupation: 'legend'}]
        const keys = ['name', 'age', 'occupation'];
        const actual = dataFormat(data, keys);
        const expected = [['Joe', 27, 'developer'], ['Mike', 30, 'legend']];
        expect(actual).toEqual(expected); 
    });
    test('Input mock table data to check functionality', () => {
        const data = testData.categoryData;
        const keys = ['slug', 'description'];
        const actual = dataFormat(data, keys);
        expect(actual).toHaveLength(4);
        actual.forEach((array) => {
            expect(array).toHaveLength(2);
        })
        })
    });
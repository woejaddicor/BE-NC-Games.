const {data} = require('../seeds/seed');
const format = require('pg-format')
const db = require('../connection');
const { categoryData } = require('../data/test-data');

exports.dataFormat = (data, keys) => {
    if (data.length === 0) return data;
    const formattedData = data.map((data) => {
    const newArr = []

    keys.forEach((key) => {
        newArr.push(data[key]);
    })
    return newArr;
})
return formattedData;
}
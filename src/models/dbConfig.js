const {Pool} = require('pg');

const config = {
    user: 'nkechianyanwu',
    host: 'localhost',
    database: 'kitchenapp',
    password: '',
    port: 5432
};
const pool = new Pool(config);


module.exports = { pool };
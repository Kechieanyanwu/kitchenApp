const Pool = require('pg').Pool;
const pool = new Pool({ //in production environment will put config details in separate file
    user: 'nkechianyanwu',
    host: 'localhost',
    database: 'kitchenapp',
    password: '',
    port: 5432
});


module.exports = { pool };
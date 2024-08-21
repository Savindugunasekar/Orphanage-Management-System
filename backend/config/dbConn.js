const {Pool} = require ('pg')

const db = new Pool({
    user:'postgres',
    password:process.env.PASSWORD,
    host:'localhost',
    port:5432,
    database:'Orphanage_MIS'
})

module.exports = db
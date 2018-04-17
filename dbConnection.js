var mysql = require("mysql");
var connection = mysql.createConnection({

    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: 'bamazon'
});
module.exports={
    connection:connection,
}

connection.connect(function(err){
    if(err) throw(err);
    console.log(`connected as id ${connection.threadId}`);

    
});
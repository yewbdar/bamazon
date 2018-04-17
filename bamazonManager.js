var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({

    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw (err);
    // console.log(`connected as id ${connection.threadId}`);
});

function queryAllProducts() {
    connection.query("SELECT * FROM Products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + "|" + res[i].stock_quantity);
        }
        console.log("-----------------------------------");

    });
    connection.end();

}
start();
function start() {
    inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "select the option",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.choice === "View Products for Sale") {
                postAuction();
            }
            else if (answer.choice === "View Products for Sale") {
                bidAuction();
            }
            else if (answer.choice === "Add to Inventory") {
                bidAuction();
            }
            else if (answer.choice === "Add New Product") {
                bidAuction();
            }
        });
}
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


start();
function start() {
    inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "select the option",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product","exit"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.choice === "View Products for Sale") {
                queryAllProducts();
            }
            else if (answer.choice === "View Low Inventory") {
                lowInventory()
            }
            else if (answer.choice === "Add to Inventory") {

            }
            else if (answer.choice === "Add New Product") {

            }
            else if (answer.choice === "exit") {
                 process.exit();
            }
        });
}
function queryAllProducts() {
    connection.query("SELECT * FROM Products", function (err, res) {
        if (res.length > 0) {
            for (var i = 0; i < res.length; i++) {
                console.log("\n" + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + "|" + res[i].stock_quantity);
            }
            console.log("-----------------------------------");
        } else {
            console.log("Data not found !")
        }
    });
  
    console.log("hi");
    start();


}
function lowInventory() {
    connection.query("SELECT * FROM Products WHERE stock_quantity < 5",
        function (err, res) {
            console.log(res.length)
            if (res.length > 0) {
                for (var i = 0; i < res.length; i++) {
                    console.log("\n" + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + "|" + res[i].stock_quantity);
                }
                console.log("-----------------------------------");
            } else {
                console.log("Data not found !")
            }

        });
        start();
}
function chooseAgain() {
    inquirer.prompt({
        name: "again",
        type: "confirm",
        message: "Would you like to continue ?"
    }).then(function (answer) {
        if (answer.again === true) {
            input();
        } else {

            process.exit();
        }
    });
}
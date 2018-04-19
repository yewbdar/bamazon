var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');
var colors = require('colors');
var connection = require("./dbConnection.js");
var product = require("./objects.js");
var isDataExist = false;
start();
function start() {
    inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "select the option",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "exit"]
        })
        .then(function (answer) {
            switch(answer.choice){
                case "View Products for Sale":
                queryAllProducts();
                break;
                case "View Low Inventory":
                queryLowInventory();
                break;
                case "Add to Inventory":
                addToInventory();
                break;
                case "Add New Product":
                addNewProduct();
                break;
                case "exit":
                console.log("Good Bye !".green);
                process.exit();
                break;
            }
        });
}
function addToInventory() {
    inquirer.prompt([{
        type: "input",
        name: "id",
        message: "What is the ID of the item you like to add more?",
        validate: function validateInput(value) {
            if (isNaN(value) === false && value != "") {
                return true;
            }
            return false;
        }
    },
    {
        type: "input",
        name: "quantity",
        message: "How many would you like to add?",
        validate: function validateInput(value) {
            if (isNaN(value) === false && value != "") {
                return true;
            }
            return false;
        }
    }
    ]).then(function (answer) {
        product.item_id = answer.id;
        product.stock_quantity = answer.quantity;
        checkIfDataExist();
    })
}
function queryAddToInventory(productName,quantity) {
    if (isDataExist) {
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: quantity,
                },
                {
                    item_id: product.item_id,
                }
            ],
            function (err, res) {
                if (err) throw err
                console.log("Successfully added ".green + product.stock_quantity.green + " quantity on ".green + productName .green+ "!\n".green);

                start();
            }
        );
        isDataExist = false;
    }
}
function checkIfDataExist() {//check if the data is avalable before update data.
    connection.query("SELECT * FROM Products WHERE ?", [{ item_id: product.item_id }], function (err, res) {
        if (err) throw err;
        if (res.length > 0) {
            isDataExist = true;
            var quan=res[0].stock_quantity + 
            product.stock_quantity
            queryAddToInventory(res[0].product_name,quan);
        }
        else {
            console.log("data not found!".red);
            start();
        }
    })
}
function queryAllProducts() {
    connection.query("SELECT * FROM Products", function (err, res) {
        if (res.length > 0) {
            var t = new Table
            res.forEach(function (product) {
                t.cell('Product Id', product.item_id)
                t.cell('product_name', product.product_name)
                t.cell('department_name', product.department_name)
                t.cell('Price', product.price )
                t.cell('stock_quantity', product.stock_quantity )
                t.newRow()
            })
            console.log(t.toString().gray)
            
        } else {
            console.log("Data not found !".red)
        }
        start();
    });
}
function addNewProduct() {
    inquirer.prompt([{
        type: "input",
        name: "prodautName",
        message: "What is the prodaut name ?",
        validate: function validateInput(value) {
            if (isNaN(value) === true && value != "") {
                return true;
            }
            return false;
        }
    }, {
        type: "input",
        name: "departmentName",
        message: "what is the department name :",
        validate: function validateInput(value) {
            if (isNaN(value) === true && value != "") {
                return true;
            }
            return false;
        }
    },
    {
        type: "input",
        name: "price",
        message: "Add price ",
        validate: function validateInput(value) {
            if (isNaN(value) === false && value != "") {
                return true;
            }
            return false;
        }
    },

    {
        type: "input",
        name: "quantity",
        message: "Add quantity",
        validate: function validateInput(value) {
            if (isNaN(value) === false && value != "") {
                return true;
            }
            return false;
        },
    }
    ]).then(function (answer) {

        product.product_name = answer.prodautName;
        product.department_name = answer.departmentName;
        product.price = answer.price;
        product.stock_quantity = answer.quantity;
        queryAddNewData();
    })
}
function queryAddNewData() {
    connection.query("INSERT INTO Products SET ? ", [{
        product_name: product.product_name,
        department_name: product.department_name,
        price: product.price,
        stock_quantity: product.stock_quantity
    }], function (err) {
        if (err) throw err
        console.log("Successfully added !".green);
        start();
    })
}
function queryLowInventory() {
    const cTable = require('console.table');
    connection.query("SELECT * FROM Products WHERE stock_quantity < 5",
        function (err, res) {
            if (err) throw err;
            if (res.length > 0) {
                var t = new Table
                res.forEach(function (product) {
                    t.cell('Product Id', product.item_id)
                    t.cell('product_name', product.product_name)
                    t.cell('department_name', product.department_name)
                    t.cell('Price', product.price )
                    t.cell('stock_quantity', product.stock_quantity )
                    t.newRow()
                })
                console.log(t.toString().gray)
                
            } else {
                console.log("Data not found !".red)
            }
            start();
        });
    
}



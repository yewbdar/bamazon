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

var product = {
    item_id: 0,
    product_name: "",
    department_name: "",
    price: 0,
    stock_quantity: 0,
}
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
            // based on their answer, either call the bid or the post functions
            if (answer.choice === "View Products for Sale") {
                queryAllProducts();
            }
            else if (answer.choice === "View Low Inventory") {
                lowInventory();
            }
            else if (answer.choice === "Add to Inventory") {
                addToInventory();
            }
            else if (answer.choice === "Add New Product") {

            }
            else if (answer.choice === "exit") {
                process.exit();
            }
        });
}
function addToInventory() {
    inquirer.prompt([{
        type: "input",
        name: "id",
        message: "What is the ID of the item you like to add more?",
        validate: function validateInput(value) {
            if (isNaN(value) === false && value != "" ) {
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
function queryAddToInventory() {
    //check if the data is avalable before update data.
     if (isDataExist) {
        console.log("am here")
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: product.stock_quantity,
                },
                {
                    item_id: product.item_id,
                }
            ],
            function (err, res) {
                if (err) throw err
                console.log("successfully added " + product.stock_quantity + " quantity on " + product.product_name + "!\n");

                start();
            }
        );
        isDataExist=false;
    }
 }
function checkIfDataExist(){
    connection.query("SELECT * FROM Products WHERE ?",[{ item_id: product.item_id }], function (err, res) {
        if (err) throw err;
        if (res.length > 0) {
            isDataExist = true;
            product.product_name=res.product_name;
            queryAddToInventory();
        }
        else{
            console.log("data not found!");
            start();
        }
    })
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
         return true;
        
    });

    console.log("hi");
    start();


}
function addNewProduct() {
    inquirer.prompt([{
        type: "input",
        name: "prodautName",
        message: "What is prodautName ?",
        validate: function validateInput(value) {
            if (isNaN(value) === true && value != "" ) {
                return true;
            }
            return false;
        }
    },{
        type: "input",
        name: "departmentName",
        message: "what is department name :",
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
        message: "quantity",
        validate: function validateInput(value) {
            if (isNaN(value) === false && value != "") {
                return true;
            }
            return false;
        },
    }
    ]).then(function (answer) {
        //product.item_id = answer.id;
        product.product_name = answer.prodautName;
        product.department_name=answer.departmentName;
        product.price=answer.price;
        product.stock_quantity=answer.quantity;
        //checkIfDataExist();

    })
}
function queryAddNewData(){
    connection.query("INSERT INTO Products SET ? ",[{
        product_name:product.product_name,
        department_name:product.department_name,
        price:product.price,
        stock_quantity:product.stock_quantity
    }],function(err){
        if(err) throw err
        console.log("new produact added !");
    })
}
function queryLowInventory() {
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

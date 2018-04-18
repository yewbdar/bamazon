var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');
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
        if(err)throw err;
        if(res.length>0){
        var t = new Table
            res.forEach(function (product) {
                t.cell('Product Id', product.item_id)
                t.cell('product_name', product.product_name)
                t.cell('department_name', product.department_name)
                t.cell('Price', product.price )
               // t.cell('product_sales', product.product_sales )
                t.cell('stock_quantity', product.stock_quantity )
                t.newRow()
            })
            console.log(t.toString())
        }
        else{
          console.log("Data not found!")
        }
        input();
    });
    // connection.end();
    
}
queryAllProducts();

var product = {
    item_id: 0,
    product_name: "",
    department_name: "",
    price: 0,         
    stock_quantity: 0,
    product_sales:0,
}

function input() {
    inquirer.prompt([{
        type: "input",
        name: "id",
        message: "What is the ID of the item you like to purchase?(select id 1- 10)",
        validate: function validateInput(value) {
            if (isNaN(value) === false && value !="" && value >=1 && value <=10) {
                return true;
            }
            return false;
        }
    },

    {
        type: "input",
        name: "quantity",
        message: "How many would you like to buy ? ",
        validate: function validateInput(value) {
            if (isNaN(value) === false && value !="") {
                return true;
            }
            return false;
        }
    }
    ]).then(function (answer) {
        product.item_id = answer.id;
        product.stock_quantity = answer.quantity;
        checkQuantity();
    })
} function purchaseAgain() {
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
function checkQuantity() {
    connection.query("SELECT * FROM Products WHERE ?", [{
        item_id: product.item_id,
    }],
        function (err, res) {
            if (err) throw err;
            if(res.length>0){
            if (res[0].stock_quantity >= product.stock_quantity) {
                product.price = res[0].price;
                var remainingQunatitiy = res[0].stock_quantity - product.stock_quantity;
                //var totalPrice=res.price*res[0].stock_quantity;
                product.product_name = res[0].product_name;
                product.department_name = res[0].department_name;
                product.price = res[0].price;
                product.product_sales=res[0].product_sales;
                updateProduct(remainingQunatitiy)
            } else {
                console.log("Insufficient quantity!");
                purchaseAgain();
            }
        }else{
            console.log("Data not found!");
        }
        });
}
function updateProduct(quantity) {
    var totalPrice=(product.price * product.stock_quantity)+product.product_sales
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: quantity,
                product_sales:totalPrice,
            },
            {
                item_id: product.item_id
            }
        ],
        function (err, res) {
            if (err) throw err
            console.log("successfully purchased " + product.stock_quantity + " " + product.product_name + "!\n");
            console.log("Total price : $" + parseFloat(product.price * product.stock_quantity).toFixed(2))
            purchaseAgain();
        }
    );
}

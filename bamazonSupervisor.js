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

var product = {
    item_id: 0,
    product_name: "",
    department_name: "",
    price: 0,
    stock_quantity: 0,
}
var department={
    departmentName:"",
    overHeadCosts:0,
}
start();
function start() {
    inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "select the option",
            choices: ["View Product Sales by Department", "Create New Department", 
            "exit"]
        })
        .then(function (answer) {
            switch (answer.choice) {
                case "View Product Sales by Department":
                    queryAllProducts();
                    break;
                case "Create New Department":
                addNewDepartment();
                    break;
                case "exit":
                    console.log("Good Bye !");
                    process.exit();
                    break;
            }
        });
}
function addNewDepartment() {
    inquirer.prompt([{
        type: "input",
        name: "departmentName",
        message: "What is the department name ?",
        validate: function validateInput(value) {
            if (isNaN(value) === true && value != "") {
                return true;
            }
            return false;
        }
    },

    {
        type: "input",
        name: "costs",
        message: "Add over head costs?",
        validate: function validateInput(value) {
            if (isNaN(value) === false && value != "") {
                return true;
            }
            return false;
        }
    }
    ]).then(function (answer) {
        department.departmentName = answer.departmentName;
        department.overHeadCosts = answer.costs;
        queryAddNewDepartment();
        
    })
}
function queryAddNewDepartment(){

    connection.query("INSERT INTO departments SET ?",[{
        department_name:department.departmentName,
        over_head_costs:department.overHeadCosts
    }],function(err,res){
         if(err)throw err;
         console.log("Succssefully added !");
         start();
    });
      
}

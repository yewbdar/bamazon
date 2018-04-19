var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');
var colors = require('colors');
var connection = require("./dbConnection.js");
var product = require("./objects.js");
var department = {
    departmentName: "",
    overHeadCosts: 0,
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
                    queryGetAllData();
                    break;
                case "Create New Department":
                    addNewDepartment();
                    break;
                case "exit":
                    console.log("Good Bye !".green);
                    process.exit();
                    break
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
function queryAddNewDepartment() {
    connection.query("INSERT INTO departments SET ?", [{
        department_name: department.departmentName,
        over_head_costs: department.overHeadCosts
    }], function (err, res) {
        if (err) throw err;
        console.log("Succssefully added !".green);
        start();
    });

}
function queryGetAllData() {
    connection.query(
        "SELECT departments.department_id,departments.department_name,departments.over_head_costs,products.product_sales FROM departments " +
        " INNER JOIN products  ON products.department_name=departments.department_name GROUP BY products.department_name ORDER BY departments.department_id ASC ",

        [{
            //can't to add an object b/c of product ...
        }], function (err, res) {
            if (err) throw err;
            var t = new Table
            res.forEach(function (department) {
                t.cell('department_id', department.department_id);
                t.cell('department_name', department.department_name);
                t.cell('over_head_costs', department.over_head_costs);
                t.cell('product_sales', department.product_sales);
                var total_profit = department.over_head_costs - department.product_sales;
                t.cell('total_profit', total_profit)
                t.newRow()
            })
            console.log(t.toString().gray)

            start();
        })

}

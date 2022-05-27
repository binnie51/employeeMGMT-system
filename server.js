// Add dependencies
const mysql = require('mysql2');
const inquirer = require('require');

const Employee = require('./lib/employee');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'employee_management_db'
    }.
    console.log(`Connected to the employee_management_db database.`)
);

function start() {
    inquirer
    .prompt({
        name: 'action-menu',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            "View All Employees",
            "Add Employees",
            "Update Employee Roles",
            "View All Roles",
            "Add Role",
            "View All Department",
            "Add Department"
        ]
    })
    .then( (answer) => {
        switch (answer.action-menu) {
            case "View All Department":
                viewDept();
                break;
            case "Add Employees":
                addEmployee()
                break;
            case "Update Employee Role":
                updateRole()
                break;
            case ""
        }
    })
}
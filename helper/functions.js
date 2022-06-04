// get connection to database
const { up } = require('inquirer/lib/utils/readline');
const { promise } = require('./connection');
const connection = require('./connection');

function getDepts() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM department`, function(err, results) {
            if (err) reject (err);
            resolve(results);
        });
    });
}

function insertDept(name, callBack) {
    const insertQuery = `INSERT INTO department SET (?)`;
    connection.query(insertQuery, {
        name: name
    }, (err, results) => {
        if (err) throw err;
        console.clear();
        console.log("\n Department ${name} sucessfully added!");
        callBack();
    })
}

function getRoles() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT role.id AS ID, title AS Title, department.name AS Department, salary AS Salary FROM role
        JOIN department ON role.department_id = department.id`, function(err, results) {
            if (err) reject (err);
            resolve(results);
        });
    });
}

function insertRole(title, salary, departmentID, callBack) {
    const insertQuery = `INSERT INTO role SET (?)`;
    connection.query(insertQuery, {
        title: title,
        salary: salary,
        department_id: departmentID
    }, (err, results) => {
        if (err) throw err;
        console.clear();
        console.log("\n New role sucessfully added!");
        callBack();
    })
}

function getEmployees() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT
        employee.id, 
        employee.first_name AS FirstName,
        employee.last_name AS LastName,
        role.title AS Title,
        role.salary AS Salary,
        department.name AS Department,
        CONCAT(manager.first_name, " ", manager.last_name) AS Manager
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT OUTER JOIN employee manager ON manager.id = employee.id;`, function (err, results) {
            if (err) reject (err);
            resolve(results);
        });
    });
}

function insertEmployee(fName, lName, roleID, managerID, callBack) {
    const insertQuery = `INSERT INTO employee SET (?)`;
    connection.query(insertQuery, {
        first_name: fName,
        last_name: lName,
        role_id: roleID,
        manager_id: managerID
    }, (err, results) => {
        if (err) throw err;
        console.clear();
        console.log("\nEmployee sucessfully added! Welcome aboard!");
        callBack();
    })
}

function employeeUpdate(roleID, employeeID, callBack) {
    const updateQuery = `UPDATE employee SET (?) WHERE id= (?)`;
    connection.query(updateQuery, [
        {
            role_id: roleID
        },
        employeeID
    ], (err, results) => {
        if (err) throw err;
        console.clear();
        console.log("\nEmployee update success!");
        callBack();
    });
}

module.exports = {
    getDepts,
    insertDept,
    getRoles,
    insertRole,
    getEmployees,
    insertEmployee,
    employeeUpdate
}
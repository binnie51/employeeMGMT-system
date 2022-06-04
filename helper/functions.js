// get connection to database
const connection = require('./connection');

function getDepts() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT id AS ID, name AS Department FROM department`, function(err, results) {
            if (err) reject (err);
            resolve(results);
        });
    });
}

function insertDept(name, callBack) {
    const insertQuery = `INSERT INTO department SET ?`;
    connection.query(insertQuery, 
        {
            name: name
        }, 
        (err, results) => {
            if (err) throw err;
            console.log("\nNew department sucessfully added!");
            callBack();
        }
    )
}

function getRoles() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT role.id, title, salary, department.name from role
        JOIN department ON department.id = role.department_id;`, function(err, results) {
            if (err) reject (err);
            resolve(results);
        });
    });
}

function insertRole(title, salary, departmentID, callBack) {
    const insertQuery = `INSERT INTO role SET ?`;
    connection.query(insertQuery, 
        {
            title: title,
            salary: salary,
            department_id: departmentID
        }, 
        (err, results) => {
            if (err) throw err;
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

function insertEmployee(firstName, lastName, roleId, managerId, callBack) {
    const insertQuery = `INSERT INTO employee SET ?`;
    connection.query(insertQuery, 
        {
            first_name: firstName,
            last_name: lastName,
            role_id: roleId,
            manager_id: managerId
    }, 
    (err, results) => {
        if (err) throw err;
        console.log("\nEmployee sucessfully added! Welcome aboard!");
        callBack();
    })
}

function employeeUpdate(roleID, employeeID, callBack) {
    const updateQuery = `UPDATE employee SET ? WHERE id= ?`;
    connection.query(updateQuery, [
        {
            role_id: roleID
        },
        employeeID
    ], (err, results) => {
        if (err) throw err;
        console.log("\nEmployee update success!");
        callBack();
    });
}

function deleteRole(role, callBack) {
    const deleteQuery = `DELETE FROM role WHERE ?`;
    connection.query(deleteQuery, 
        {
            title: role
        },
        (err, results) => {
            if (err) throw err;
            console.log("\nRole deleted.");
            callBack();
        }
    )
}



module.exports = {
    getDepts,
    insertDept,
    getRoles,
    insertRole,
    getEmployees,
    insertEmployee,
    employeeUpdate,
    deleteRole
}
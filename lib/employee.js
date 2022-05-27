// import mysql
const mysql = require('mysql2/promise');

class Employee {
    constructor(firstName, lastName, roleId, managerId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.roleId = roleId;
        this.managerId = managerId;
    }

    // Insert to employee 
    async insertEmployee() {
        const database = await mysql.createConnection(
            {
                host: 'localhost',
                user: 'root',
                password: 'rootroot',
                database: 'employee_management_db'
            },
        );
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?)`
        const params = [this.firstName, this.lastName, this.roleId, this.managerId];
        const [rows, fields] = await database.execute(query, params);
        console.log("\n Employee sucessfully added! Welcome aboard!")
        return;
    }

    // select all employee
    async selectAllEmployee() {
        const database = await mysql.createConnection(
            {
                host: 'localhost',
                user: 'root',
                password: 'rootroot',
                database: 'employee_management_db'
            },
        );
        const query = 'SELECT id, first_name, last_name, role_id, manager_id FROM employee;'
        const [rows, fields] = await database.execute(query);
        return(rows);
    }
}

module.exports = Employee;
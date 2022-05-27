const { Console } = require('console');
const mysql = require('mysql2/promise');
const { last } = require('rxjs');


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
        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id)'
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
        const query = 'SELECT id, first_name, last_name, role_id, manager_id, from employee;'
        const [rows, fields] = await database.execute(query);
        return(rows);
        
    }
}


module.exports = Employee;
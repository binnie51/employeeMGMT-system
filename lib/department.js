// import mysql
const mysql = require('mysql2/promise');

class Department {
    constructor(name) {
        this.name = name;
    }

    // insert to department
    async insertDept() {
        const database = await mysql.createConnection(
            {
                host: 'localhost',
                user: 'root',
                password: 'rootroot',
                database: 'employee_management_db'
            }
        );
        const query = `INSERT INTO department (name) VALUES (?)`
        const params = [this.name];
        const [rows, fields] = await database.execute(query, params);
        console.log("\n Department sucessfully added!")
        return;
    }

    // select all departments
    async selectAllDept() {
        const database = await mysql.createConnection(
            {
                host: 'localhost',
                user: 'root',
                password: 'rootroot',
                database: 'employee_management_db'
            },
        );
        const query = `SELECT id, name FROM department;`
        const [rows, fields] = await database.execute(query);
        return(rows);
    }
}

module.exports = Department;
const mysql = require('mysequel/promise');

class Role {
    constructor(title, salary, department_id) {
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
    }

    // insert to 'role' table
    async insertRole() {
        const database = await mysql.createConnection(
            {
                host: 'localhost',
                user: 'root',
                password: 'rootroot',
                database: 'employee_management_db'
            },
        );
        const query = 'INSERT INTO role (title, salary, department_id) VALUES (?)'
        const params = [this.title, this.salary, this.department_id];
        const [rows, fields] = await database.execute(query, params);
        console.log("\n New role sucessfully added to the table!")
        return (rows); 
    }

    // select all 'role'
    async selectAllRole() {
        const database = await mysql.createConnection(
            {
                host: 'localhost',
                user: 'root',
                password: 'rootroot',
                database: 'employee_management_db'
            },
            console.log("Connected to 'role' from employee_management_db")
        );
        const query = 'SELECT id, title, salary, department_id FROM role;'
        const [rows, fields] = await database.execute(query);
        return(rows);
    }

    // delete role
    async deleteRole(id) {
        const database = await mysql.createConnection(
            {
                host: 'localhost',
                user: 'root',
                password: 'rootroot',
                database: 'employee_management_db'
            },
        );
        const query = `DELETE FROM role WHERE id = ?;`
        const params = [id];
        const [rows, fields] = await database.execute(query, params);
        
        console.log('\n Role deleted.');
        return;
    }
}

module.exports = Role;
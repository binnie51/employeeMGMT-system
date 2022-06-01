// Add dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table')

// import all classes from lib
const Employee = require('./lib/employee');
const Department = require('./lib/department');
const Role = require('./lib/role');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'employee_management_db'
    },
    console.log('Connected to the employee_management_db database.')
);

function init() {
    inquirer
    .prompt({
        name: 'menu',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            "View All Employees",
            "Add Employees",
            "Update Employee",
            "View All Roles",
            "Add Role",
            "View All Department",
            "Add Department",
            "Delete Role",
            "Done"
        ]
    })
    .then( (answer) => {
        switch (answer.menu) {
            case "View All Department": // ok
                viewDept();
                break;
            case "Add Employees":
                addNewEmployee()
                break;
            case "Update Employer":
                updateEmployee()
            case "Delete Role":
                roleDelete()
                break;
            case "View All Roles": // ok
                viewRoles()
                break;
            case "Add Role":
                addNewRole()
                break;
            case "View All Employees": // ok
                viewEmployee()
                break;
            case "Add Department": // ok
                addNewDept()
                break;
            case "Done":
                db.end();
                break;    
        }
    })
}

// Display all departments
async function viewDept() {
    const dept = new Department();
    const result = await dept.selectAllDept();
    console.log('Department table displayed.')
    console.table(result);
    init()
    return;
}

// Display all roles
async function viewRoles() {
    const role = new Role();
    const result = await role.selectAllRole();
    console.log('Role table displayed.')
    console.table(result);
    init();
    return;
}

// Display all employees
async function viewEmployee() {
    const employee = new Employee();
    const result = await employee.selectAllEmployee();
    console.log('Employee table displayed.')
    console.table(result);
    init();
    return;
}

// Add new a department to the table
async function addNewDept() {
    const questionNewDept = {
        name: 'newDeptName',
        message: 'What will you call this new department?',
        type: 'input'
    }
   await inquirer.prompt(questionNewDept)
   .then( (userInput) => {
       const getDept = new Department(userInput.addNewDept);
       insertNewDept(getDept);
   });
   return;
}

async function insertNewDept(getDept) {
    await getDept.insertDept();
    init();
    return;
}

// Add new role to the table
async function addNewRole() {
    const dept = new Department();
    const displayDeptTable = await dept.selectAllDept();
    const deptList = function (displayDeptTable) {
        const listDepts = [];
        displayDeptTable.forEach(element => {
            listDepts.push(element.id + '.' + element.name)
        });
        return deptList;
    }

    // Inquirer for new Role to be added
    const questionsNewRole = [
    {
        name: 'newRoleTitle',
        message: 'Enter title for this role:',
        type: 'input'
    },
    {
        name: 'salaryForRole',
        message: 'Enter salary for this role:',
        type: 'input'
    },
    {
        name: 'roleInDept',
        message: 'Select department for this role:',
        type: 'list',
        choices: deptList(displayDeptTable)
    }
    ]
    await inquirer.prompt(questionsNewRole)
    .then( (userInput) => {
        const idSeparator = userInput.roleInDept.split('.');
        const deptId = Number(idSeparator[0]);
        const salary = parseFloat(userInput.salaryForRole);
        const getRole = new Role(userInput.newRoleTitle, salary, deptId);
        insertNewRole(getRole);
    });
    return;
}

async function insertNewRole(getRole) {
    await getRole.insertRole();
    init();
    return;
}

// Add new employee to the table
async function addNewEmployee() {
    // role list
    const role = new Role();
    const displayRoleTable = await role.selectAllRole();
    const roleList = function(displayRoleTable) {
        const listRoles = [];
        displayRoleTable.forEach(element => {
            listRoles.push(element.id + '.' + element.title);
        });
        return listRoles;
    }
    // managers list 
    const manager = new Employee();
    const displayManagers = await manager.selectAllEmployee();
    const managersList = function(displayManagers) {
        const listManagers = [];
        displayManagers.forEach(element => {
            listManagers.push('0.None');
            displayManagers.push('element.id' + '.' + element.first_name + '.' + element.last_name);
        });
        return listManagers
    }
    // Inquirer for new Employee to be added
    const questionsNewEmployee = [
        {
            name: 'firstName',
            message: "Enter employes's first name:",
            type: 'input'
        },
        {
            name: 'lastName',
            message: "Enter employee's last name:",
            type: 'input'
        },
        {
            name: 'roleID',
            message: 'Enter role ID:',
            type: 'list',
            choices: roleList(displayRoleTable)
        },
        {
            name: 'managerName',
            maessage: "Enter employee's manager:",
            type: 'list',
            choices: managersList(displayManagers)
        }
    ]
    await inquirer.prompt(questionsNewEmployee)
    .then( (userInput) => {
        let detailsEmployee;
        const roleIdSeparator = userInput.roleID.spli('.');
        const roleId = Number(roleIdSeparator[0]);

        const managerIdSeparator = userInput.managerName;
        const managerId = Number(managerIdSeparator[0]);

        // if manager's ID exist on, then this employee is a 'manager' to be registered
        if (managerId > 0) {
            detailsEmployee = new Employee(userInput.firstName, lastName, roleId, managerId);
        }
        else {
            detailsEmployee = new Employee(userInput.firstName, lastName, roleId, null)
        }
        insertNewEmployee(detailsEmployee);
    });
    return;
}

async function insertNewEmployee(detailsEmployee) {
    await detailsEmployee.insertEmployee();
    init();
    return;
}

async function roleDelete() {
    // role list to be used
    let roleID;
    const role = new Role();
    const displayRoleTable = await role.selectAllRole();
    const roleList = function(displayDeptTable) {
        const listRoles = [];
        displayDeptTable.forEach(element => {
            listRoles.push(element.id = '.' + element.title);
        });
        return listRoles;
    }
    const questionsRole2bDelete = {
            name: 'roleID',
            message: 'Select roles to be deleted.',
            type: 'list',
            choices: roleList(displayRoleTable)
        }
        await inquirer.prompt(questionsRole2bDelete)
        .then((userInput) => {
            const idSeparator = userInput.roleID.split('.');
            roleID = Number(idSeparator[0]);
        });
        const roleDetails = new Role();
        await roleDetails.deleteRole(roleID);
        init();
}

// update employee role 
async function updateEmployee() {
    inquirer.prompt([
        {
            name:'employeeID',
            message: "Enter employee's ID you wish to update:",
            type: 'number'
        },
        {
            name: 'roleID',
            maessage: "Enter the updated role ID:",
            type: 'number'
        }
    ])
    .then( (userInput) => {
        db.query('UPDATE employee_management_db SET role_id=? WHERE id= ?', [userInput.roleID, userInput.employeeID], (err, result) => {
            if (err) throw console.error();
            viewEmployee();
            return;
        });
    });
}

// Initiate the program
init();
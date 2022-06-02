// Add dependencies
// const mysql = require('mysql2/promise')
const inquirer = require('inquirer');
const table = require('console.table');

// import all classes from lib
const Employee = require('./lib/employee');
const Department = require('./lib/department');
const Role = require('./lib/role');

// const db = mysql.createConnection(
//     {
//         host: 'localhost',
//         user: 'root',
//         password: 'rootroot',
//         database: 'employee_management_db'
//     },
//     console.log('Connected to the employee_management_db database.')
// );

const menuQuestions = {
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
}

async function init() {
    await inquirer
    .prompt(menuQuestions)
    .then( (answer) => {
        switch (answer.menu) {
            case "View All Department": 
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
            case "View All Roles": 
                viewRoles()
                break;
            case "Add Role":
                addNewRole()
                break;
            case "View All Employees": 
                viewEmployee()
                break;
            case "Add Department":
                addNewDept()
                break;
            case "Done":
                console.log('Closing database application. Bye!')
                process.exit(0);  
        }
        return;
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
        listManagers.push('0.None');
        displayManagers.forEach(element => {
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
            message: "Employee's role ID:",
            type: 'list',
            choices: roleList(displayRoleTable)
        },
        {
            name: 'managerName',
            maessage: "Employee's manager:",
            type: 'list',
            choices: managersList(displayManagers)
        }
    ]
    await inquirer.prompt(questionsNewEmployee)
    .then( (userInput) => {
        let detailsEmployee;
        const roleIdSeparator = userInput.roleID.split('.');
        const roleId = Number(roleIdSeparator[0]);

        const managerIdSeparator = userInput.managerName.split('.');
        const managerId = Number(managerIdSeparator[0]);

        // if manager's ID exist on, then this employee is a 'manager' to be registered
        if (managerId > 0) {
            detailsEmployee = new Employee(userInput.firstName, userInput.lastName, roleId, managerId);
        }
        else {
            detailsEmployee = new Employee(userInput.firstName, userInput.lastName, roleId, null)
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

// Delete a role
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

//  Update employee role 
async function updateEmployee() {
    // prep role list
    const role = new Role();
    const displayRoleTable = await role.selectAllRole();
    const roleList = function(displayRoleTable) {
        const listRoles = [];
        displayRoleTable.forEach(element => {
            listRoles.push(element.id + '.' + element.title);
        });
        return listRoles;
    }
    // prep employee list
    const employee = new Employee();
    const displayEmp = await employee.selectAllEmployee();
    const empList = function(displayEmp) {
        const listEmployee = [];
        displayEmp.forEach(element => {
            listEmployee.push('element.id' + '.' + element.first_name + '.' + element.last_name);
        });
        return listEmployee;
    }
    const updateQuestions = [
        {
            name:'employee',
            message: "Select an employee you wish to update:",
            type: 'list',
            choices: empList(displayEmp)
        },
        {
            name: 'newRole',
            maessage: "Choose new role for this employee:",
            type: 'list',
            choices: roleList(displayRoleTable)

        }
    ]
    await inquirer.prompt(updateQuestions)
    .then( (userInput) => {
        let employeeDetails
        const empIdSeparator = userInput.employee.split('.');
        const empId = Number(empIdSeparator[0]);

        const roleIdSeparator = userInput.newRole.split('.');
        const roleId = Number(roleIdSeparator[0]);

        if (empId === userInput.employee) {
            employeeDetails = new Employee(firstName, lastName, userInput.newRole, userInput.employee)
        }

        // db.query('UPDATE employee_management_db SET role_id=? WHERE id= ?', [userInput.roleID, userInput.employeeID], (err, result) => {
        //     console.log("Employee's data is updated!")
        //     return;
        // });
    });
}

// Initiate the program
init();
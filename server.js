// Add dependencies
// const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');
const connection = require('./helper/connection');
const funcs = require('./helper/functions');
require('dotenv').config();

// test connection of the server, 
// then proceeds to initialize app if connection has been established
connection.connect(err => {
    if (err) throw err;
    console.log('Connection established!');
    init();
});

function getName(e) {
    return `${e.FirstName} ${e.LastName}`;
}

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
    .then((answer) => {
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
                connection.end();
                break;
        }
        return;
    })
}

// Display all departments
function viewDept() {
    funcs.getDepts()
    .then((results) => {
        console.log("\nDisplaying all despartments.");
        console.table(results);
        init();
    })
    .catch((err) => {
        throw err;
    });
}

// Display all roles
function viewRoles() {
    funcs.getRoles()
    .then((results) => {
        console.log("\nDisplaying existing roles.");
        console.table(results);
        init()
    })
    .catch((err) => {
        throw err;
    });
}

// Display all employees
function viewEmployee() {
    funcs.getEmployees()
    .then((results) => {
        console.log("\nDisplaying current active employees.");
        console.table(results);
        init();
    })
    .catch((err) => {
        throw err;
    });
}

// Add new a department to the table
// conditionals set for users to input a new department name. Will not accept NULL as an entry
function addNewDept() {
    const questionNewDept = {
        name: 'newDeptName',
        message: 'What will you call this new department?',
        type: 'input',
        validate: (value) => {
            if (value) {
                return true;
            }
            else {
                console.log("You must enter a new department name!")
            }
        }
    }
    inquirer.prompt(questionNewDept)
    .then((userInput) => {
        funcs.insertDept(userInput.newDeptName, init)
    });
}

// Add new role to the table
async function addNewRole() {
    // Inquirer for new Role to be added
    // need 'for loop' to display all the role options
    const deptQuery = `SELECT * FROM department`;
    connection.query(deptQuery, (err, results) => {
        if (err) throw err;
        // prepare questions
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
            message: 'Select department for this role',
            type: 'list',
            choices: () => {
                let choices = [];
                for (let i = 0; i< results.length; i++) {
                    choices.push(results[i].name);
                }
                return choices;
            }
        }
        ]
        inquirer.prompt(questionsNewRole)
        .then( (userInput) => {
            // let values = [userInput.newRoleTitle, userInput.salaryForRole, userInput.roleInDept];
            // return connection.promise().query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, values);
            let choiceDept;
            for (let i = 0; i < results.length; i++) {
                if (results[i].name === userInput.roleInDept) {
                    choiceDept = results[i];
                }
            }
            connection.query(`INSERT INTO role SET ?`, 
                {
                    title: userInput.newRoleTitle, 
                    salary: userInput.salaryForRole, 
                    department_id: choiceDept.id
                },
                (err) => {
                    if (err) throw err;
                    console.log("\nNew role sucessfully added to the table!");
                    init();
                }
            )
        });
        
    });
}

// Add new employee to the table
async function addNewEmployee() {
    const roles = await funcs.getRoles();
    const employees = await funcs.getEmployees();
    
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
            name: 'role',
            message: "Select role for this employee",
            type: 'list',
            choices: () => roles.map((d) => d.title)
        },
        {
            name: 'managerName',
            maessage: "Select employee's manager:",
            type: 'list',
            choices: () => ["None", ...employees.map((e) => getName(e))]
        }]
        inquirer.prompt(questionsNewEmployee)
        .then((userInput) => {
            const role = roles.find((d) => d.title.toLowerCase() === userInput.role.toLowerCase());
            const employee = employee.find((d) => {
                const name = getName(d);
                return name.toLocaleLowerCase() === userInput.managerName.toLowerCase();
            });
        funcs.insertEmployee(
            userInput.firstName, userInput.lastName, role.id, userInput.managerName === "None" ? null : employee.id,
            init
        );   
    });
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
        let employeeUpdate
        const empIdSeparator = userInput.employee.split('.');
        const empId = Number(empIdSeparator[0]);

        const roleIdSeparator = userInput.newRole.split('.');
        const roleId = Number(roleIdSeparator[0]);

        if (empId && roleId) {
            employeeUpdate = new Employee(firstName, lastName, userInput.newRole, userInput.employee)
        }
        updateEmployeeDetails(employeeUpdate);
        // db.query('UPDATE employee_management_db SET role_id=? WHERE id= ?', [userInput.roleID, userInput.employeeID], (err, result) => {
        //     console.log("Employee's data is updated!")
        //     return;
        // });
    });
    return;
}

async function updateEmployeeDetails(detailsEmployee) {
    await detailsEmployee.employeeUpdate();
    init();
}
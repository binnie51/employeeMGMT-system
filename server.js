// Add dependencies
// const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');
const connection = require('./helper/connection');
const funcs = require('./helper/functions');
require('dotenv').config();

// figlet package to provides op/title  to the cms
const figlet = require('figlet');

figlet("Employee \n \n Manager", (err, data) => {
    if (err) throw err;
    console.log(data);
})

// test connection of the server, 
// then proceeds to initialize app if connection has been established
connection.connect(err => {
    if (err) throw err;
    console.log('Connection established!');
    init();
});

// Function to get each individual employees' name displayed on the selection
function getName(e) {
    return `${e.FirstName} ${e.LastName}`;
}

// menu options
const menuQuestions = {
    name: 'menu',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee",
        "View All Roles",
        "Add Role",
        "View All Department",
        "Add Department",
        "Delete Department",
        "Delete Role",
        "Delete Employee",
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
            case "Update Employee":
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
            case "Delete Department":
                deptDelete()
                break;
            case "Delete Employee":
                empDelete()
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
            choices: () => {
                let choices = [];
                for (let i = 0; i< roles.length; i++) {
                    choices.push(roles[i].title);
                }
                return choices;
            }
        },
        {
            name: 'managerName',
            maessage: "Select employee's manager:",
            type: 'list',
            choices: () => ["None", ...employees.map((d) => getName(d))]
        }]
        inquirer.prompt(questionsNewEmployee)
        .then((userInput) => {
            const role = roles.find((d) => d.title.toLowerCase() === userInput.role.toLowerCase());
            const employee = employees.find((d) => {
                const name = getName(d);
                return name.toLocaleLowerCase() === userInput.managerName.toLowerCase();
            });
        funcs.insertEmployee(
            userInput.firstName, userInput.lastName, role.id, userInput.managerName === "None" ? null : employee.id,
            init
        );   
    });
}

// Delete a department
async function deptDelete() {
    const departments = await funcs.getDepts();
    //inquirer
    const questionsDept2bDelete = {
        name: 'deptName',
        message: 'Select a department to be deleted:',
        type: 'list',
        choices: () => {
            let choices = [];
            for (let i = 0; i< departments.length; i++) {
                choices.push(departments[i].name);
            }
            return choices;
        }
    }
    inquirer.prompt(questionsDept2bDelete)
    .then((userInput) => {
        funcs.deleteDept(userInput.deptName,
            init)
    });
}

// Delete a role
async function roleDelete() {
    const roles = await funcs.getRoles();
    // inquirer
    const questionsRole2bDelete = {
        name: 'roleID',
        message: 'Select a role to be deleted:',
        type: 'list',
        choices: () => {
            let choices = [];
            for (let i = 0; i< roles.length; i++) {
                choices.push(roles[i].title);
            }
            return choices;
            }
        }
        inquirer.prompt(questionsRole2bDelete)
        .then((userInput) => {
            funcs.deleteRole(userInput.roleID, 
                init)
        });
}

// // Delete an employee
async function empDelete() {
    const employees = await funcs.getEmployees();

        // inquirer
        const questionsEmp2bDelete = {
            name: 'emp',
            message: 'Choose an ID of an employee to be deleted:',
            type: 'list',
            choices: employees.map((e) => getName(e))
        } 
        inquirer.prompt(questionsEmp2bDelete)
        .then((userInput) => {
            const employee = employees.find((n) => {
                const name = getName(n);
                return name.toLocaleLowerCase() === userInput.emp.toLocaleLowerCase();
            });

            funcs.deleteEmp(employee.id,
                init)
        });
}

//  Update employee role 
async function updateEmployee() {
    const roles = await funcs.getRoles();
    const employees = await funcs.getEmployees();

    // inquirer
    const updateQuestions = [
        {
            name:'empName',
            message: "Select an employee you wish to update:",
            type: 'list',
            choices: employees.map((e) => getName(e))
        },
        {
            name: 'newRole',
            maessage: "Choose new role for this employee:",
            type: 'list',
            choices: () => {
                let choices = [];
                for (let i = 0; i< roles.length; i++) {
                    choices.push(roles[i].title);
                }
                return choices;
            }
        }
    ]
    inquirer.prompt(updateQuestions)
    .then((userInput) => {
        const newRole = roles.find((role) => role.title.toLocaleLowerCase() === userInput.newRole.toLocaleLowerCase());
        const employee = employees.find((n) => {
            const name = getName(n);
            return name.toLocaleLowerCase() === userInput.empName.toLocaleLowerCase();
        });
        funcs.employeeUpdate(
            newRole.id, employee.id,
            init
        );
    });
}

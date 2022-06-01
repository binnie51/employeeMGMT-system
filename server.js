// Add dependencies
const mysql = require('mysql2');
const inquirer = require('require');

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
    }.
    console.log(`Connected to the employee_management_db database.`)
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
            "Update Employee Roles",
            "View All Roles",
            "Add Role",
            "View All Department",
            "Add Department",
            "Done"
        ]
    })
    .then( (answer) => {
        switch (answer.menu) {
            case "View All Department":
                viewDept();
                break;
            case "Add Employees":
                addNewEmployee()
                break;
            case "Update Employee Role":
                addNewRole()
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
                console.log("Bye!");
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
    const role = new Role();
    const displayRoleTable = await role.selectAllRole();
    const roleList = function(displayRoleTable) {
        const listRoles = [];
        displayRoleTable.forEach(element => {
            listRoles.push(element.id + '.' + element.title);
        });
        return roleList;
    }
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
        }
    ]
}

// Initiate the program
init();
SELECT
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
LEFT JOIN employee manager ON manager.id = employee.id;
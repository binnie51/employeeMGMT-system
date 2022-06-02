DROP DATABASE IF EXISTS employee_management_db;
CREATE DATABASE employee_management_db;

USE employee_management_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NULL,
    manager_id INT NULL,
    FOREIGN KEY (manager_id) REFERENCES employee(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
    ON DELETE SET NULL
);

-- SELECT * FROM department;
-- SELECT * FROM role;
-- SELECT * FROM employee
const fs = require('fs');

let employees = [];

let departments = [];

const initialize = () => {

    return new Promise((resolve, reject) => {
        try {
        
            fs.readFile('./data/departments.json', 'utf8', (err,data) => {
                if(err) {
                    throw err;
                }
                if(data.length !== 0){
                departments = JSON.parse(data);
                }
            });

            fs.readFile('./data/employees.json', 'utf8', (err,data) => {
                if(err) {
                    throw err;
                }

                if(data.length !== 0){
                employees = JSON.parse(data);
                }
            });

    
        } catch (err) {
            console.log(err)
            reject("Unable to read the file");
        }

        resolve("file was read successfully")
    });

};

const getAllEmployees = () => {

    return new Promise((resolve, reject) => {
        try {
            if (employees.length === 0){
                throw "No results returned"
            }
    
            //console.log(employees);
        } catch (error) {
            reject(error);
        }
        resolve(employees);
    });
}; 

const getEmployeesByStatus = (status) => {

    const statusToLower = status.toLowerCase();

    return new Promise((resolve, reject) => {

        try {     
            let employeesByStatus = [0];      
            if(statusToLower === 'full time' || statusToLower === 'part time'){
                employeesByStatus = employees.filter(employee => employee.status.toLowerCase() === statusToLower);
                console.log(employeesByStatus);
                resolve(employeesByStatus);
            } else {
                throw `Status "${status}" is invalid!`;
            }

            if(employeesByStatus.length === 0){
                throw "No results returned";
            }
        } catch (error) {
            reject(error);
        }

    });
}


const getEmployeesByDepartment = (department) => {

    

    const isDepartmentValid = department > 0 && department < 8


    return new Promise((resolve, reject) => {        

        try {     
            let employeesByDepartment = [];

            if(isDepartmentValid){

                employeesByDepartment = employees.filter(employee => employee.department == department);
                resolve(employeesByDepartment);

            } else {
                throw `${department} is not a valid department!`;
            }

            if(employeesByDepartment.length === 0){
                throw "No results returned";
            }
        } catch (error) {           
            reject(error);
        }

    });
}

const getEmployeesByManager = (manager) => {


    return new Promise((resolve, reject) => {        

        try { 
            //(there are currently 30 managers in the dataset) 
            if( manager > 30){
                throw "No results returned";
            }
            
            const employeesByManager = employees.filter(employee => employee.employeeManagerNum == manager);

            if(employeesByManager.length === 0){
                throw "No results returned";
            }
            resolve(employeesByManager);
        } catch (error) {
            reject(error);
        }
        
    });
}

const getEmployeesByNum = (num) => {
    

    return new Promise((resolve, reject) => {        

        try {   
            
            if( num <= employees.length ){
            const employeesByManager = employees.find(employee => employee.employeeNum == num);
                    
            resolve(employeesByManager);
            } else {
                throw "No results returned";
            }                        

        } catch (error) {
            reject(error);
        }

    });
}

const getManagers = () => {    

    return new Promise((resolve, reject) => {

        try {
            if (employees.length === 0){
                throw "No results returned";
            }
    
            const managers = employees.filter(employee => employee.isManager );
            if(managers.length === 0){
                throw "No results returned";
            }
            resolve(managers);
            
        } catch (error) {
            reject(error);
        }           
        
    });
}

const getDepartments = () => {
    
    return new Promise((resolve, reject) => {

        try {
            if (departments.length === 0){
                throw "No results returned";
            }

        resolve(departments);
        } catch (error) {
            reject(error);
        }
    
    });
}

const addEmployee = (employeeData) => {

    return new Promise((resolve, reject) => {

        try {
            if(!employeeData.isManager){
                employeeData.isManager = false;
            }
    
            employeeData.employeeNum = employees.length + 1;
            employees.push(employeeData);

            resolve("Success");
        } catch (error) {
            reject(error);
        }
        
    });
}

module.exports = {
    initialize,
    getAllEmployees,
    addEmployee,
    getDepartments,
    getManagers,
    getEmployeesByNum,
    getEmployeesByManager,
    getEmployeesByDepartment,
    getEmployeesByStatus    
}

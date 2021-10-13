const fs = require('fs');

let employees = [];

let departments = [];

module.exports.initialize = () => {

    return new Promise((resolve, reject) => {
        try {
        
            fs.readFile('./data/departments.json', 'utf8', (err,data) => {
                if(err) {
                    throw err;
                }
                if(data.length !== 0){
                departments = JSON.parse(data);
                }
                //console.log(departments);
            });

            fs.readFile('./data/employees.json', 'utf8', (err,data) => {
                if(err) {
                    throw err;
                }

                if(data.length !== 0){
                employees = JSON.parse(data);
                }
                //console.log(employees);
            });

    
        } catch (err) {
            console.log(err)
            reject("Unable to read the file");
        }

        resolve("file was read successfully")
    });

};

module.exports.getAllEmployees = () => {

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

module.exports.getEmployeesByStatus = (status) => {

    const statusToLower = status.toLowerCase();

    return new Promise((resolve, reject) => {

        try {     
            const employeesByStatus = [];      
            if(statusToLower === 'full-time' || statusToLower === 'part-time'){
                employeesByStatus = employees.filter(employee => employee.status === statusToLower);
                console.log(JSON.parse(employeesByStatus));
                resolve(JSON.parse(employeesByStatus));
            } else {
                throw `Status ${status} is invalid!`;
            }

            if(employeesByStatus.length === 0){
                throw "No results returned";
            }
        } catch (error) {
            reject(error);
        }

    });
}


module.exports.getEmployeesByDepartment = (department) => {

    const isDepartmentValid = department > 0 && department < 8

    return new Promise((resolve, reject) => {        

        try {     
            const employeesByDepartment = [];      
            if(isDepartmentValid){
                employeesByDepartment = employees.filter(employee => employee.department === department);
                resolve(employeesByDepartment);
            } else {
                throw `${department} is invalid!`;
            }

            if(employeesByDepartment.length === 0){
                throw "No results returned";
            }
        } catch (error) {
            reject(error);
        }

    });
}

module.exports.getEmployeesByManager = (manager) => {


    return new Promise((resolve, reject) => {        

        try {     
            const employeesByManager = employees.filter(employee => employee.employeeManagerNum === manager);

            if(employeesByManager.length === 0){
                throw "No results returned";
            }
            resolve(employeesByManager);
        } catch (error) {
            reject(error);
        }
        
    });
}

module.exports.getEmployeesByNum = (num) => {


    return new Promise((resolve, reject) => {        

        try {   
            
            if( employees.length <= num){
            const employeesByManager = employees.filter(employee => employee.employeeNum === num);
            resolve(employeesByManager);
            } else {
                throw "No results returned";
            }                        

        } catch (error) {
            reject(error);
        }

    });
}

module.exports.getManagers = () => {    

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

module.exports.getDepartments = () => {
    
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

module.exports.addEmployee = (employeeData) => {

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
        
    })
}

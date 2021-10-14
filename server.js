const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require('fs');
const data_service = require("./data-service.js");
//const { resolve } = require("path");


const HTTP_PORT = process.env.PORT || 8081;

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage })

app.use(express.static('public'));

//Adding the built-in "express.urlencoded" middleware 
app.use(express.urlencoded({extended: true}));

const onHttpStart = async () => {
    console.log(`Express http server listening on: ${HTTP_PORT}`);    
    await data_service.initialize().then(data => console.log(data)).catch(error => console.log(error));
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, './views/home.html'));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, './views/about.html'));
});

app.get("/employees/add", async (req,res) => {
    res.sendFile(path.join(__dirname, './views/addEmployee.html'));
});

app.get("/employees", async (req,res) => {

    try {
        let response = [];

        if(req.query.status){
            response = await data_service.getEmployeesByStatus(req.query.status);
            res.json(response);
        }
        else if(req.query.department){
            response = await data_service.getEmployeesByDepartment(req.query.department);
            res.json(response);
        }
        else if(req.query.manager){
            response = await data_service.getEmployeesByManager(req.query.manager);
            res.json(response);
        } else {
            response = await data_service.getAllEmployees();
            res.json(response);
        }     


    } catch (error) {
        res.json({message: error});
    }
});

app.get("/employee/:employeeNum", async(req, res) => {

    const employeeNum = req.params.employeeNum;
    const isEmployeeValid = !isNaN(employeeNum);

    try {

        if(isEmployeeValid){

            const response = await data_service.getEmployeesByNum(employeeNum);
            res.json(response);
        } 
        
    } catch (error) {
        res.json({message: error});
    }
});

app.get("/managers",async (req, res) => {
    try {
        const response = await data_service.getManagers();
        res.json(response);
    } catch (error) {
        res.json({message: error});
    }
});

app.get("/departments", async (req,res) => {
    try {
        const response = await data_service.getDepartments();
        res.json(response);
    } catch (error) {
        res.json({message: error});
    }

});

app.get("/images", function(req, res) {
    fs.readdir(path.join(__dirname,"/public/images/uploaded"),
    function(err, items){
        if(items.length > 0){
            res.json({images: items});
        } else {
            res.json({message: "There are currently no images"})
        }
    });
});


app.get("/images/add", async (req,res) => {
    res.sendFile(path.join(__dirname, './views/addImage.html'));
});

app.get("*", (req, res) => {
    res.send("<p>Error 404 Page Not Found</p>")
});

app.post("/images/add", upload.single("imageFile"), function(req, res) {
    res.redirect("/images");
});

app.post("/employees/add", function(req, res){
    data_service.addEmployee(req.body).then(
        res.redirect('/employees')
    );
})


app.listen(HTTP_PORT, onHttpStart);


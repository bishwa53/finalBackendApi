const Knex = require("knex");
const knexOptions = require("./knexfile");
const knex = Knex(knexOptions);

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function getAllUsers(req,res){
    knex
    .select()
    .table('teachers')
    .then((data)=>{
        res.json(data)
    })
    .catch(error => {
        res.json({"fail":"Error occured!"})
    })
}

function registerTeacher(req,res){

    //hash password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    // required db values
    var values = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        contact: req.body.contact,
        address: req.body.address,
        username: req.body.username,
        password: hashedPassword
    };

    //add to db
    knex('teachers')
    .insert(values)
    .then(
        ()=>{
            res.json({'status':'teacher registered'})
        }
    )
    .catch(error => {
            res.json({'status':'error'})
    })

    
}

function registerStudent(req,res){

    //hash password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    // required db values
    var values = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        contactNumber: req.body.contactNumber,
        address: req.body.address,
        class: req.body.class,
        username: req.body.username,
        password: hashedPassword
    };

    //add to db
    knex('students')
    .insert(values)
    .then(
        ()=>{
            res.json({'status':'student registered'})
        }
    )
    .catch(error => {
            res.json({'status':'error'})
    })
}

function getAllStudent(req,res){
    knex
    .select()
    .table('students')
    .then((data)=>{
        res.json(data)
    })
    .catch(error => {
        res.json({"fail":"Error occured!"})
    })
}

// attendance
function getAttendance(req,res){
    knex
    .select()
    .table('attendance')
    .then((data)=>{
        res.json(data)
    })
    .catch(error => {
        res.json({"fail":"Error occured!"})
    })
}

function addAttendance(req,res){
   
    // required db values
    var values = {
        class: req.body.class,
        subject: req.body.subject,
        datetime: req.body.datetime
    };

    //add to db
    knex('attendance')
    .insert(values)
    .then(
        ()=>{
            res.json({'status':'attendance added'})
        }
    )
    .catch(error => {
            res.json({'status':'error'})
    })
}

// login
function login(req,res){
    
    const username = req.body.username;
    const passwordFromJSON = req.body.password;
    const loginType = req.params.loginType;
    const table = "teachers";
    if(loginType == "student" ) table = "students";

    knex
    .table(table)
    .first('password')
    .where('username', username)
    .then(data => {
        if (!data) {
            res.json({
            status: 'fail',
            message: 'Unregistered username'
            })
        } else {
            const password = data.password;
            const isMatch = bcrypt.compareSync(passwordFromJSON, password);
            if (isMatch) {
                // password matched
                res.json(
                    {
                        status : "success",
                        message : jwt.sign({username: username}, 'key')
                    }
                )
            } else {
                res.json("Authentication denied")
            }
        }
        
    })
    .catch(error => {
        res.json("error")
    })
}


module.exports = {
    registerTeacher : registerTeacher,
    getAllUsers : getAllUsers,
    registerStudent : registerStudent,
    getAllStudent : getAllStudent,
    addAttendance : addAttendance,
    getAttendance : getAttendance,
    login:login
}
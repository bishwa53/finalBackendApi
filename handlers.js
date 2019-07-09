const Knex = require("knex");
const knexOptions = require("./knexfile");
const knex = Knex(knexOptions);

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function getAllTeacher(req,res){
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
        username: req.body.username,
        class: req.body.class,
        password: hashedPassword
    };

    //add to db
    knex('student')
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
    .table('student')
    .then((data)=>{
        res.json(data)
    })
    .catch(error => {
        res.json("Error occured!")
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
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
today = yyyy +"-"+mm+"-"+dd;

function getTodayAttendance(req,res){
    knex
    .table('student')
    .join('attendance', 'student.id', '=', 'attendance.studentId')
    .where('attendance.attDate',today)
    .select('student.id','student.firstName','student.lastName','attendance.status')
    .then((data)=>{
        res.json(data)
    })
}

function getTodayAttendanceOfStudent(req,res){
    knex
    .table('student')
    .join('attendance', 'student.id', '=', 'attendance.studentId')
    .where({'attendance.attDate':today,'student.id':req.params.studentId})
    .select('student.id','student.firstName','student.lastName','attendance.status')
    .then((data)=>{
        res.json(data)
    })
}

function getInfo(req,res){
    if( !req.params.token ) res.json({success:false,status:"Unauthenticated access."})
    else{
        const payload = jwt.verify(req.params.token, 'key');
        knex
        .select()
        .table(req.params.loginType)
        .where('username',payload.username)
        .then((data)=>{
            res.json({
                success:true,
                status : "user data response",
                data : data[0]
            })
        })
    }

}

function addUpdateAttendance(req,res){
    

    // required db values
    var values = {
        status: req.body.status,
        studentId: req.body.studentId,
        attDate: today
    };

    //add to db
    knex('attendance')
    .select('id')
    .where({attDate:today,studentId:req.body.studentId})
    .then(data=>{
        if(data.length == 1){
            knex('attendance')
            .update('status',values.status)
            .where('id',data[0].id)
            .then(
                ()=>{
                    res.json('attendance updated')
                }
            )
            .catch(error => {
                    res.json('error')
            })
        }else{
            knex('attendance')
            .insert(values)
            .then(
                ()=>{
                    res.json('attendance added')
                }
            )
            .catch(error => {
                    res.json('error')
            })
        }
    })
    
}

// login
function login(req,res){
    
    const username = req.body.username;
    const passwordFromJSON = req.body.password;
    const loginType = req.params.loginType;
    var table = "teachers";
    if(loginType == "student" ) table = "student";

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
                res.json({
                    status: 'fail',
                    message:"Username or paswword is wrong"
                })
            }
        }
        
    })
    .catch(error => {
        res.json({
            status: 'fail',
            message:"error"
        })
    })
}

function loginAdmin(req,res){
    const adminUsername = "admin";
    const adminPassword = "admin";

    if( req.body.username == adminUsername && req.body.password == adminPassword ){
        res.json({message:'ok'})
    }else{
        res.json({message:'Invalid username or password.'})
    }
}


function deleteTeacher(req,res){
    knex('teachers')
    .delete()
    .where('id',req.params.id)
    .then(data=>{
        res.end("Teacher deleted")
    })
    .catch(er=>{
        res.end("error")
    })
}

function deleteStudent(req,res){
    knex('student')
    .delete()
    .where('id',req.params.id)
    .then(data=>{
        res.end("Student deleted")
    })
    .catch(er=>{
        res.end("error")
    })
}

function editTeacher(req,res){
    knex('teachers')
    .where({ id: req.params.id })
    .update( req.body.colName , req.body.colValue)
    .then(
        ()=>{
            res.end("Teacher has been updated")
        }
    )
    .catch(er=>{
        res.end('error')
    })  
}

function editStudent(req,res){
    knex('student')
    .where({ id: req.params.id })
    .update( req.body.colName , req.body.colValue)
    .then(
        ()=>{
            res.end("Student has been updated")
        }
    )
    .catch(er=>{
        res.end('error')
    })  
}


module.exports = {
    registerTeacher : registerTeacher,
    getAllTeacher : getAllTeacher,
    registerStudent : registerStudent,
    getAllStudent : getAllStudent,
    getAttendance : getAttendance,
    login:login,
    loginAdmin:loginAdmin,
    deleteTeacher : deleteTeacher,
    deleteStudent : deleteStudent,
    editTeacher:editTeacher,
    editStudent:editStudent,
    addUpdateAttendance:addUpdateAttendance,
    getTodayAttendance:getTodayAttendance,
    getTodayAttendanceOfStudent:getTodayAttendanceOfStudent,
    getInfo:getInfo
}
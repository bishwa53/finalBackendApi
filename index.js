const Express = require("express")
const app = Express()
const cors = require('cors')
const handlers = require('./handlers');

//body parser stuffs
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//use cors
app.use(cors());

const route = "/api/";

// teacher api
app.post(route+"teacher",handlers.registerTeacher)
app.get(route+"teacher",handlers.getAllTeacher)
app.delete(route+"teacher/:id",handlers.deleteTeacher)
app.put(route+"teacher/:id",handlers.editTeacher)

// student api
app.post(route+"student",handlers.registerStudent)
app.get(route+"student",handlers.getAllStudent)
app.delete(route+"student/:id",handlers.deleteStudent)
app.put(route+"student/:id",handlers.editStudent)


// attendance api
app.post(route+"attendance",handlers.addUpdateAttendance)
app.get(route+"attendance",handlers.getAttendance)
app.get(route+"attendance/today",handlers.getTodayAttendance)
app.get(route+"attendance/today/:studentId",handlers.getTodayAttendanceOfStudent)


//login
app.post(route+"login/users/:loginType",handlers.login)
app.post(route+"login/admin/",handlers.loginAdmin)
app.get(route+"login/users/info/:loginType/:token",handlers.getInfo)

//start server
const port = 3000;
app.listen(port,()=>{
    console.log("Server listening on "+port);
})
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
app.get(route+"teacher",handlers.getAllUsers)

// teacher api
app.post(route+"teacher",handlers.registerTeacher)


// student api
app.post(route+"student",handlers.registerStudent)
app.get(route+"student",handlers.getAllStudent)


// attendance api
app.post(route+"attendance",handlers.addAttendance)
app.get(route+"attendance",handlers.getAttendance)


//login
app.post(route+"login/:loginType",handlers.login)

//start server
const port = 3000;
app.listen(port,()=>{
    console.log("Server listening on "+port);
})
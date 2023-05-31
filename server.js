const express = require('express')
const exphbs = require('express-handlebars')
const db = require('./db-connector')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const app = express()

const CRUDStudents = require('./CRUDs/CRUDStudents')
const CRUDProfessors = require('./CRUDs/CRUDProfessors')
const CRUDCourses = require('./CRUDs/CRUDCourses')
const CRUDClassrooms = require('./CRUDs/CRUDClassrooms')
const CRUDSchedules = require('./CRUDs/CRUDSchedules')

const statesOb = require('./CRUDs/additionalData/states')
const citiesOb = require('./CRUDs/additionalData/cities')

app.engine('handlebars', exphbs.engine({
    defaultLayout: "main"
}))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Students Entity CRUD queries
CRUDStudents.addStudent(app, db)            // CREATE
CRUDStudents.getStudent(app, db)            // READ
CRUDStudents.updateStudent(app, db)         // UPDATE
CRUDStudents.deleteStudent(app, db)         // DELETE

// Gets a specific student's schedules
CRUDStudents.getStudentSchedules(app, db)

// Gets a specific student's schedule's courses
CRUDStudents.getStudentCourses(app, db)

// Gets a specific course's details
CRUDCourses.getCourseDetails(app, db)

// Professors Entity CRUD queries
CRUDProfessors.getProfessors(app, db)       // READ
CRUDProfessors.addProfessor(app, db)        // CREATE
CRUDProfessors.deleteProfessor(app, db)     // DELETE
CRUDProfessors.updateProfessor(app, db)     // UPDATE

// Classroom Entity CRUD queries
CRUDClassrooms.getClassrooms(app, db)
CRUDClassrooms.addClassroom(app, db)
CRUDClassrooms.updateClassroom(app, db)
CRUDClassrooms.deleteClassroom(app, db)

// Courses Entity CRUD queries
CRUDCourses.getCourses(app, db)
CRUDCourses.addCourse(app, db)
CRUDCourses.updateCourse(app, db)
CRUDCourses.deleteCourse(app, db)

// Gets all the schedules in the database
CRUDSchedules.getSchedules(app, db)

app.get('/backarrow', (req, res, next)=>{
    res.sendFile(__dirname + '/public/assets/backarrow.png')
})

app.get('/homeIcon', (req, res, next)=>{
    res.sendFile(__dirname + '/public/assets/home.png')
})

app.get('/addIcon', (req, res, next)=>{
    res.sendFile(__dirname + '/public/assets/plus.png')
})

app.get('/getStates', (req, res, next) => {
    res.send(statesOb.getStates)
})

app.get('/getCities', (req, res, next) => {
    res.send(citiesOb.getCities)
})

app.listen(port, (err) => {
    if (err) { throw err }
    console.log("== Server listening on port", port)
})


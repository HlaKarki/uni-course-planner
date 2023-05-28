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

// Gets all the classrooms in the database
CRUDClassrooms.getClassrooms(app, db)

// Gets all the courses in the database
CRUDCourses.getCourses(app, db)

// Gets all the schedules in the database
CRUDSchedules.getSchedules(app, db)

app.get('/backarrow', (req, res, next)=>{
    res.sendFile(__dirname+'/public/assets/backarrow.png')
})

app.listen(port, (err) => {
    if (err) { throw err }
    console.log("== Server listening on port", port)
})


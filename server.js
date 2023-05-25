const express = require('express')
const exphbs = require('express-handlebars')
const db = require('./db-connector')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const app = express()

const CRUDStudents = require('./CRUDStudents')
const CRUDProfessors = require('./CRUDProfessors')


app.engine('handlebars', exphbs.engine({
    defaultLayout: "main"
}))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Students Entity CRUD queries
CRUDStudents.addStudent(app, db)        // CREATE
CRUDStudents.getStudent(app, db)        // READ
CRUDStudents.updateStudent(app, db)     // UPDATE
CRUDStudents.deleteStudent(app, db)     // DELETE

app.get('/studentSchedules/:studentID', (req, res, next) => {
    const studentId = parseInt(req.params.studentID, 10)
    let studentName = ""
    if (studentId === 1){
        studentName = "Cameron"
    }
    else if (studentId === 2){
        studentName = "Hla"
    }
    else if (studentId === 3){
        studentName = "Trenton"
    }
    console.log("== Student id: ", studentId)

    const studentSchedules = [
        {
            scheduleId: 1,
            totalCredits: 16,
            term: "Spring 2023",
            studentId: 1
        }
    ]
    res.status(200).render('studentSchedulesPage', {
        studentName: studentName,
        studentSchedules
    })
})

app.get('/studentCourses/:studentId', (req, res, next) => {
    const studentId = parseInt(req.params.studentId, 10)
    let studentName = ""
    if (studentId === 1){
        studentName = "Cameron"
    }
    else if (studentId === 2){
        studentName = "Hla"
    }
    else if (studentId === 3){
        studentName = "Trenton"
    }
    console.log("== Student id from courses: ", studentId)

    // 1, Intro to assembly, , 4, CS 162, A-
    const studentCourses = [
        {
            courseId: 1,
            title: "Intro to Assembly",
            description: "Learning IA32, MASM and CISC Architecture",
            credits: 4,
            prereq: "CS 162",
            grade: "A-"
        }
    ]
    res.status(200).render('studentCoursesPage', {
        studentName: studentName,
        term: "Spring 2023",
        studentCourses
    })
})

app.get("/courseDetails/:courseId", (req, res, next) => {
    const courseId = parseInt(req.params.courseId, 10)
    let courseTitle = ""
    const courseDetails = [
        {
            courseId: courseId,
            title: "Intro to Assembly",
            professor: "Paris Kalathas",
            totalEnrolled: 1,
            online: 0,
            meetTime: "17:00 MWs",
            location: "Weniger 153"
        },
        {
            courseId: courseId,
            title: "Intro to Database",
            professor: "Christopher Buss",
            totalEnrolled: 1,
            online: 0,
            meetTime: "08:00 MWs",
            location: "Weniger 151"
        }
    ]

    res.status(200).render('courseDetailsPage', {
        courseName: "Test course title",
        courseDetails
    })
})

// Professors Entity CRUD queries
CRUDProfessors.getProfessors(app, db)
CRUDProfessors.addProfessor(app, db)
CRUDProfessors.deleteProfessor(app, db)
CRUDProfessors.updateProfessor(app, db)

app.get("/classrooms", (req, res, next) => {
    const classrooms = [
        {
            classroomId: 1,
            totalSeats: 60,
            building: "Weniger",
            roomNumber: 153
        },
        {
            classroomId: 2,
            totalSeats: 150,
            building: "Weniger",
            roomNumber: 151
        },
        {
            classroomId: 3,
            totalSeats: 105,
            building: "Linus Pauling Science Center",
            roomNumber: 125
        }
    ]
    res.status(200).render('classroomsPage', {
        classrooms
    })
})

app.get("/courses", (req, res, next) => {
    const courses = [
        {
            id: 1,
            name: "Intro To Assembly",
            instructor: "Paris Kalathas",
            totalEnrolled: 1,
            online: 0,
            time: "17:00 MWs",
            location: "Weniger 153"
        },
        {
            id: 2,
            name: "Intro To Database",
            instructor: "Christopher Buss",
            totalEnrolled: 1,
            online: 0,
            time: "08:00 MWs",
            location: "Weniger 151"
        },
        {
            id: 3,
            name: "Web Development",
            instructor: "Robb Hess",
            totalEnrolled: 1,
            online: 1
        }
    ]
    res.status(200).render('coursesPage', {
        courses
    })
})

app.get("/schedules", (req, res, next) => {
    const schedules = [
        {
            id: 1,
            idStudent: 1,
            username: "cameron",
            credits: 16,
            term: "Spring 2023"
        },
        {
            id: 2,
            idStudent: 2,
            username: "hla",
            credits: 20,
            term: "Spring 2023"
        },
        {
            id: 3,
            idStudent: 3,
            username: "trenton",
            credits: 22,
            term: "Spring 2023"
        }
    ]
    res.status(200).render('schedulesPage', {
        schedules
    })
})

app.listen(port, (err) => {
    if (err) { throw err }
    console.log("== Server listening on port", port)
})


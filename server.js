const express = require('express')
const exphbs = require('express-handlebars')

let port = process.env.PORT || 3000
const app = express()

app.engine('handlebars', exphbs.engine({
    defaultLayout: "main"
}))

app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname+'/public/index.html')
})

app.get('/students', (req,res,next) => {
    res.status(200).render('studentsPage')
})

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

    res.status(200).render('studentSchedulesPage', {
        studentName: studentName,
        studentId: studentId
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

    res.status(200).render('studentCoursesPage', {
        studentName: studentName,
        term: "Spring 2023"
    })
})

app.get("/courseDetails/:courseId", (req, res, next) => {
    const courseId = parseInt(req.params.courseId, 10)
    let courseName = ""

    res.status(200).render('courseDetailsPage', {
        courseName: "Test course title",
        online: 0
    })
})

app.get("/professors", (req, res, next) => {
    res.status(200).render('professorsPage')
})

app.get("/classrooms", (req, res, next) => {
    res.status(200).render('classroomsPage')
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


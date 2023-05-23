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

app.get('/studentsPage', (req,res,next) => {
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
        courseName: "Test title"
    })
})

app.listen(port, (err) => {
    if (err) { throw err }
    console.log("== Server listening on port", port)
})


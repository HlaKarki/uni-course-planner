const express = require('express')
const exphbs = require('express-handlebars')
const db = require('./db-connector')

const bodyParser = require('body-parser')


let port = process.env.PORT || 3000
const app = express()

app.engine('handlebars', exphbs.engine({
    defaultLayout: "main"
}))

app.set('view engine', 'handlebars')

app.use(express.static('public'))

// Parse URL-encoded bodies (if form data is sent with 'content-type': 'application/x-www-form-urlencoded')
app.use(bodyParser.urlencoded({ extended: false }));

// Parse JSON bodies (if form data is sent with 'content-type': 'application/json')
app.use(bodyParser.json());

app.get('/students', (req,res,next) => {
    const getStudents = `
                            SELECT Students.idStudent, username, email, major, CONCAT(streetName, ", ", state, ", ", zipCode) AS address
                            FROM Students
                            JOIN Addresses ON Students.idStudent = Addresses.idStudent
                            WHERE Addresses.idAddress = (
                              SELECT MAX(idAddress)
                              FROM Addresses
                              WHERE Addresses.idStudent = Students.idStudent
                            )
                            ORDER BY Students.idStudent ASC;
                        `
    const allStudents = []
    db.pool.query(getStudents, (err, students, fields) => {
        let individualStudent = {}
        students.map((student, index) => {
            individualStudent = {
                studentId: parseInt(student.idStudent, 10),
                username: student.username,
                email: student.email,
                major: student.major,
                // address: "123blah"
                address: student.address
            }
            allStudents.push(individualStudent)
        })
        console.log(allStudents);
        res.status(200).render('studentsPage', {
            allStudents
        })
    })
})

app.post('/addStudent', async (req, res, next) => {
    const form_input = req.body

    const insertStudent = `INSERT INTO Students(username, email, major) VALUES (?, ?, ?);`
    const insertAddress = `INSERT INTO Addresses(idStudent, streetName, city, state, zipCode, country) VALUES(?, ?, ?, ?, ?, ?);`
    const getStudentId = `SELECT idStudent FROM Students ORDER BY idStudent DESC LIMIT 1;`

    db.pool.query(insertStudent, [ form_input["username"], form_input["email"], form_input["major"] ], (err, newStudents, fields) => {
        if (err){
            console.log(err);
            res.sendStatus(400)
        }
        else {
            console.log(newStudents);
            db.pool.query(getStudentId, (err, id, fields)=>{
                console.log("Showing latest student id");
                console.log(id[0].idStudent)
                db.pool.query(insertAddress, [ id[0].idStudent, form_input["streetName"], form_input["city"], form_input["state"], form_input["zipcode"], form_input["country"] ], (err, newAddress, fields) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(400)
                    }
                    else {
                        console.log("== new Address: ", newAddress);
                        res.redirect('/students')
                    }
                })
            })
        }
    })
})

app.post('/deleteStudent', (req, res, next) => {
    const form_input = req.body
    let idStudent = form_input["studentDelete"]
    const deleteStudent = `DELETE FROM Students WHERE idStudent = ${idStudent};`

    db.pool.query(deleteStudent, (err, students, fields) => {
        if (err) { res.sendStatus(400)}
        else {
            console.log(students);
            res.redirect('/students')
        }
    })
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

app.get("/professors", (req, res, next) => {
    const professors = [
        {
            professorId: 1,
            firstName: "Paris",
            lastName: "Kalathas",
            email: "kalathap@oregonstate.edu"
        },
        {
            professorId: 2,
            firstName: "Christopher",
            lastName: "Buss",
            email: "bussch@oregonstate.edu"
        },
        {
            professorId: 3,
            firstName: "Robb",
            lastName: "Hess",
            email: "hessro@oregonstate.edu"
        }
    ]
    res.status(200).render('professorsPage', {
        professors
    })
})

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


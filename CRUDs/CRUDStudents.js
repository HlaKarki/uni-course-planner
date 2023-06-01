const majorsOb = require('./additionalData/majors')
const countriesOb = require('./additionalData/countries')

module.exports.getStudent = (app, db) => {
    return (
        app.get('/students', (req, res, next) => {
            const majors = majorsOb.getMajors
            const countries = countriesOb.getCountries

            const getStudents = `
                                SELECT Students.idStudent, username, email, major, CONCAT(streetName, ", ", city, ", ", state, ", ", zipCode, ", ", country) AS address
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
                        address: student.address
                    }
                    allStudents.push(individualStudent)
                })
                // console.log("=== new students: ", allStudents);
                res.status(200).render('studentsPage', {
                    allStudents, majors, countries
                })
            })
        })
    )
}

module.exports.addStudent = (app, db) => {
    return (
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
                    // console.log("== new Students: ", newStudents);
                    db.pool.query(getStudentId, (err, id, fields)=>{
                        db.pool.query(insertAddress, [ id[0].idStudent, form_input["streetName"], form_input["city"], form_input["state"], form_input["zipcode"], form_input["country"] ], (err, newAddress, fields) => {
                            if (err) {
                                console.log(err)
                                res.sendStatus(400)
                            }
                            else {
                                // console.log("== new Address: ", newAddress);
                                res.redirect('/students')
                            }
                        })
                    })
                }
            })
        })
    )
}

module.exports.updateStudent = (app, db) => {
    return (
        app.post('/updateStudent', (req, res, next) => {
            const form_input = req.body
            const updateStudent = `
                            UPDATE Students
                            SET username = '${form_input["usernameUpdate"]}',
                                email = '${form_input["emailUpdate"]}',
                                major = '${form_input["majorUpdate"]}' 
                            WHERE idStudent = '${form_input["idStudent"]}';
                        `
            const updateAddress = `
                            UPDATE Addresses
                            SET streetName = '${form_input["streetNameUpdate"]}',
                                city = '${form_input["cityUpdate"]}',
                                state = '${form_input["stateUpdate"]}',
                                zipCode = '${form_input["zipcodeUpdate"]}',
                                country = '${form_input["countryUpdate"]}'
                            WHERE idStudent = '${form_input["idStudent"]}'
                            AND idAddress = (
                                              SELECT MAX(idAddress)
                                              FROM Addresses
                                              WHERE idStudent = '${form_input["idStudent"]}'
                                            );
                        `
            db.pool.query(updateStudent, (err, updated, fields)=>{
                if (err) {res.sendStatus(400)}
                else{
                    // console.log("=== new updated Students: ", updated);
                    db.pool.query(updateAddress, (err, newAddress, fields)=>{
                        if(err) {res.sendStatus(400)}
                        else {
                            // console.log(newAddress);
                            res.redirect('/students')
                        }
                    })
                }
            })
        })
    )
}

module.exports.deleteStudent = (app, db) => {
    return (
        app.post('/deleteStudent', (req, res, next) => {
            const form_input = req.body
            let idStudent = form_input["studentDelete"]
            const deleteStudent = `DELETE FROM Students WHERE idStudent = ${idStudent};`

            db.pool.query(deleteStudent, (err, students, fields) => {
                if (err) { res.sendStatus(400)}
                else {
                    // console.log(students);
                    res.redirect('/students')
                }
            })
        })
    )
}

module.exports.getStudentSchedules = (app, db) => {
    return (
        app.get('/studentSchedules/:studentID', (req, res, next) => {
            const idStudent = parseInt(req.params.studentID, 10)
            const getStudentSchedule = `SELECT * FROM Schedules WHERE idStudent = ${idStudent};`
            const getStudentName = `SELECT username FROM Students WHERE idStudent = ${idStudent};`

            db.pool.query(getStudentName, (err, receivedName, fields)=>{
                if (err) { res.sendStatus(400) }
                else {
                    const notCapStudentName = receivedName[0].username
                    const studentName = notCapStudentName.charAt(0).toUpperCase() + notCapStudentName.slice(1);
                    db.pool.query(getStudentSchedule, (err, schedules, fields)=>{
                        let studentSchedules = []
                        let idSchedule
                        if (err) { res.sendStatus(400) }
                        else{
                            schedules.map(schedule => {
                                let individualStudents = {
                                    idSchedule: schedule.idSchedule,
                                    totalCreditHours: schedule.totalCreditHours,
                                    idStudent: schedule.idStudent,
                                    term: schedule.term
                                }
                                studentSchedules.push(individualStudents)
                                idSchedule = schedule.idSchedule
                            })
                            // console.log(schedules);
                            // console.log(idSchedule)
                            res.status(200).render('studentSchedulesPage', {
                                studentName: studentName,
                                studentSchedules,
                                idStudent,
                                idSchedule
                            })
                        }
                    })
                }
            })
        })
    )
}

module.exports.addStudentSchedule = (app, db) => {
    return (
        app.post('/addStudentSchedule/:idStudent', (req, res, next) => {
            const form_input = req.body
            const idStudent = req.params.idStudent
            const addStudentSchedule = `INSERT INTO Schedules(idStudent, totalCreditHours, term)
                                        Values(${idStudent}, 0, '${form_input["term"]}');`

            // console.log(form_input)
            // console.log(addStudentSchedule);
            db.pool.query(addStudentSchedule, (err, received, fields) => {
                err ? res.sendStatus(400) : (res.redirect(`/studentSchedules/${idStudent}`))
            })
        })
    )
}

module.exports.deleteStudentSchedule = (app, db) => {
    return (
        app.post('/deleteStudentSchedule', (req, res, next) => {
            const form_input = req.body
            const deleteStudentSchedule = `DELETE FROM Schedules WHERE idSchedule = ${form_input["scheduleDelete"]};`
            // console.log(form_input)
            // console.log(form_input["hiddenIdStudent"])
            db.pool.query(deleteStudentSchedule, (err, received, fields) => {
                err ? res.sendStatus(err) : (res.redirect(`/studentSchedules/${form_input["hiddenIdStudent"]}`))
            })
        })
    )
}


module.exports.getStudentCourses = (app, db) => {
    return (
        app.get('/studentCourses/:idSchedule', (req, res, next) => {
            const idSchedule = req.params.idSchedule
            const getStudentCourses = `
                                        SELECT idCourse, title AS course, description as description, creditHours AS credits, prerequisites AS prereq, grade AS grade
                                        FROM Courses NATURAL JOIN CourseSchedules AS CS
                                        WHERE CS.idSchedule = ${idSchedule};
                                       `
            const getStudentName =  `
                                        SELECT username FROM Students NATURAL JOIN Schedules WHERE idSchedule = ${idSchedule};
                                    `

            const getAvailableCourses = ` SELECT title, idCourse FROM Courses;`
            db.pool.query(getStudentName, (err, receivedUsername, fields) => {
                if (err) { res.sendStatus(400) }
                else {
                    let courseNames = []
                    db.pool.query(getAvailableCourses, (err, recCourseNames, fields) => {
                        if (err) { res.sendStatus(400) }
                        else {
                            recCourseNames.map(course => {
                                let individualTitle = {
                                    title: course.title,
                                    idCourse: course.idCourse
                                }
                                courseNames.push(individualTitle)
                            })

                            const notCapStudentName = receivedUsername[0].username
                            const studentName = notCapStudentName.charAt(0).toUpperCase() + notCapStudentName.slice(1);
                            // console.log(capitalizedStudentName);
                            db.pool.query(getStudentCourses, (err, receivedCourses, fields)=>{
                                let studentCourses = []

                                if (err) { res.sendStatus(400) }
                                else{
                                    // console.log(receivedCourses);
                                    receivedCourses.map(course => {
                                        let individualCourse = {
                                            course: course.course,
                                            idCourse: course.idCourse,
                                            description: course.description,
                                            credits: course.credits,
                                            prereq: course.prereq,
                                            grade: course.grade
                                        }
                                        if (individualCourse.prereq === "NULL"){
                                            individualCourse.prereq = "None"
                                        }

                                        let individualCourseName = {
                                            title: course.course
                                        }
                                        studentCourses.push(individualCourse)
                                    })
                                    res.status(200).render('studentCoursesPage', {
                                        studentName: studentName,
                                        term: "Spring 2023",
                                        studentCourses,
                                        courseNames,
                                        idSchedule
                                    })
                                }
                            })
                        }
                    })
                }
            })
        })
    )
}

module.exports.addStudentCourses = (app, db) => {
    return (
        app.post('/addStudentCourse/:idSchedule', (req, res, next) => {
            const form_input = req.body
            const idSchedule = req.params.idSchedule

            console.log(form_input)
            console.log(idSchedule)

            const addStudentCourse =`INSERT INTO CourseSchedules(idSchedule, idCourse, grade)
                                     VALUES( ${idSchedule}, ${form_input["course"]}, '${form_input["grade"]}');  `

            console.log(addStudentCourse)

            db.pool.query(addStudentCourse, (err, recCourseSchedules, fields) => {
                err ? res.sendStatus(400) : res.redirect(`/studentCourses/${idSchedule}`)
            })
        })
    )
}
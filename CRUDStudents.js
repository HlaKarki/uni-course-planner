const db = require("./db-connector");
module.exports.getStudent = function(app, db){
    return (
        app.get('/students', (req, res, next) => {
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
                    allStudents
                })
            })
        })
    )
}

module.exports.addStudent = function(app, db){
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

module.exports.updateStudent = function(app, db){
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

module.exports.deleteStudent = function(app, db){
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

module.exports.getStudentSchedules = function(app, db){
    return (
        app.get('/studentSchedules/:studentID', (req, res, next) => {
            const idStudent = parseInt(req.params.studentID, 10)
            const getStudentSchedule = `SELECT * FROM Schedules WHERE idStudent = ${idStudent};`
            const getStudentName = `SELECT username FROM Students WHERE idStudent = ${idStudent};`
            let studentName = ""

            db.pool.query(getStudentName, (err, receivedName, fields)=>{
                if (err) { res.sendStatus(400) }
                else {
                    studentName = receivedName[0].username
                    db.pool.query(getStudentSchedule, (err, schedules, fields)=>{
                        let studentSchedules = []
                        if (err) { res.sendStatus(400) }
                        else{
                            console.log(schedules);
                            schedules.map(schedule => {
                                let individualStudents = {
                                    idSchedule: schedule.idSchedule,
                                    totalCreditHours: schedule.totalCreditHours,
                                    idStudent: schedule.idStudent,
                                    term: schedule.term
                                }
                                studentSchedules.push(individualStudents)
                            })
                            res.status(200).render('studentSchedulesPage', {
                                studentName: studentName,
                                studentSchedules
                            })
                        }
                    })
                }
            })
        })
    )
}
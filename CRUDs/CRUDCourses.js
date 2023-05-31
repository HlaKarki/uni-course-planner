const {NULL} = require("mysql/lib/protocol/constants/types");
module.exports.getCourses = (app, db) => {
    return (
        app.get("/courses", (req, res, next) => {
            const getCourses = `SELECT
                                    Courses.idCourse,
                                    Courses.idClassroom,
                                    Courses.idProfessor,
                                    Courses.title,
                                    CONCAT(firstName, ' ', lastName) AS professor,
                                    description,
                                    prerequisites,
                                    creditHours,
                                    totalEnrolled,
                                    online,
                                    meetingTime,
                                    CONCAT(building, ' ', roomNumber) AS location
                                FROM
                                    Courses
                                    INNER JOIN Professors ON Professors.idProfessor = Courses.idProfessor
                                    LEFT JOIN Classrooms ON Classrooms.idClassroom = Courses.idClassroom
                                ORDER BY
                                    idCourse ASC;
                                `

            const getProfessors = ` SELECT
                                        idProfessor,
                                        concat(firstName, ' ', lastName) as profName
                                    FROM Professors;`

            const getClassrooms = ` SELECT
                                        idClassroom,
                                        concat(building, ' ', roomNumber) as location
                                    FROM Classrooms;`

            db.pool.query(getCourses, (err, receivedCourses, fields) => {
                const courses = []
                const courseNames = []
                if (err) { res.sendStatus(400) }
                else {
                    // console.log("======== debug: ", receivedCourses)
                    receivedCourses.map(course => {
                        let individualCourse = {
                            idCourse: course.idCourse,
                            idClassroom: course.idClassroom,
                            idProfessor: course.idProfessor,
                            title: course.title,
                            professor: course.professor,
                            totalEnrolled: course.totalEnrolled,
                            online: course.online,
                            meetingTime: course.meetingTime,
                            location: course.location,
                            description: course.description,
                            creditHours: course.creditHours,
                            prerequisites: course.prerequisites
                        }
                        courses.push(individualCourse)

                        let individualCourseTitle = {
                            title: course.title
                        }
                        courseNames.push(individualCourseTitle)
                    })
                    db.pool.query(getProfessors, (err, receivedProfs, fields) => {
                        const professors = []
                        if (err) { res.sendStatus(400) }
                        else {
                            receivedProfs.map(professor => {
                                let individualProf = {
                                    idProfessor: professor.idProfessor,
                                    profName: professor.profName
                                }
                                professors.push(individualProf)
                            })
                            // console.log(professors);
                            db.pool.query(getClassrooms, (err, receivedClassrooms, fields) => {
                                let classrooms = []
                                if (err) { res.sendStatus(400) }
                                else{
                                    receivedClassrooms.map(classroom => {
                                        let individualClassrooom = {
                                            idClassroom: classroom.idClassroom,
                                            location: classroom.location
                                        }
                                        classrooms.push(individualClassrooom)
                                    })
                                    res.status(200).render('coursesPage', {
                                        courses, professors, classrooms, courseNames
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

module.exports.addCourse = (app, db) => {
    return (
        app.post("/addCourse", (req, res, next) => {
            const form_input = req.body
            let classroom = form_input["classroom"]
            if (!classroom){ classroom = "NULL"}
            const addCourse = ` INSERT INTO Courses(idClassroom, idProfessor, title, description, creditHours, prerequisites, totalEnrolled, meetingTime, online)
                                VALUES (${classroom}, '${form_input["professor"]}', '${form_input["title"]}', '${form_input["description"]}', ${form_input["creditHours"]}, '${form_input["prerequisites"]}', 0, '${form_input["meetingTime"]}', ${form_input["online"] === "yes" ? 1 : 0});`

            // console.log(addCourse);
            db.pool.query(addCourse, (err, received, fields) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(400)
                }
                else {
                    // console.log(received);
                    res.redirect("/courses")
                }
            })
        })
    )
}

module.exports.updateCourse = (app, db) => {
    return (
        app.post("/updateCourse", (req, res, next) => {
            const form_input = req.body
            const onlineUpdate = (!form_input["onlineUpdate"] ? 0 : 1)
            const classroom = (!form_input["classroomUpdate"] ? "NULL" : form_input["classroomUpdate"])

            const updateCourse = `  UPDATE Courses
                                    SET 
                                        idClassroom     = ${classroom},
                                        idProfessor     = ${form_input["professorUpdate"]},
                                        title           = '${form_input["titleUpdate"]}',
                                        description     = '${form_input["descriptionUpdate"]}',
                                        creditHours     = ${form_input["creditHoursUpdate"]},
                                        prerequisites   = '${form_input["prerequisitesUpdate"]}',
                                        meetingTime     = '${form_input["meetingTimeUpdate"]}',
                                        online          = ${onlineUpdate}
                                    WHERE
                                        idCourse        = ${form_input["idCourse"]};
                                    `
            // console.log(updateCourse);
            db.pool.query(updateCourse, (err, received, fields) => {
                if (err) {
                    console.log(err)
                    res.sendStatus(400)
                }
                else {
                    res.redirect('/courses')
                }
            })
        })
    )
}

module.exports.deleteCourse = (app, db) => {
    return (
        app.post("/deleteCourse", (req, res, next) => {
            const form_input = req.body
            const deleteCourse = `DELETE FROM Courses WHERE idCourse = ${parseInt(form_input["courseDelete"], 10)};`

            db.pool.query(deleteCourse, (err, received, fields) => {
                if (err) { res.sendStatus(400) }
                else {
                    res.redirect('/courses')
                }
            })
        })
    )
}

module.exports.getCourseDetails = (app, db)=>{
    return (
        app.get("/courseDetails/:courseId", (req, res, next) => {
            const idCourse = req.params.courseId
            const getCourseDetails = `  
                                        SELECT
                                            Courses.idCourse,
                                            Courses.title,
                                            CONCAT(firstName, ' ', lastName) AS professor,
                                            description,
                                            creditHours,
                                            prerequisites,
                                            totalEnrolled,
                                            online,
                                            meetingTime,
                                            CONCAT(building, ' ', roomNumber) AS location
                                        FROM
                                            Courses
                                            NATURAL JOIN Professors
                                            LEFT JOIN Classrooms ON Classrooms.idClassroom = Courses.idClassroom
                                        WHERE
                                            Courses.idCourse = ${idCourse};
                                    `

            db.pool.query(getCourseDetails, (err, receivedDetails, fields)=>{
                let courseDetails = []
                let courseName = receivedDetails[0].title
                if (err) { res.sendStatus(400) }
                else {
                    // console.log(receivedDetails);
                    receivedDetails.map(detail => {
                        let individualDetail = {
                            idCourse: detail.idCourse,
                            title: detail.title,
                            professor: detail.professor,
                            description: detail.description,
                            creditHours: detail.creditHours,
                            prerequisites: detail.prerequisites,
                            totalEnrolled: detail.totalEnrolled,
                            online: detail.online,
                            meetingTime: detail.meetingTime,
                            location: detail.location
                        }
                        if (individualDetail.prerequisites === "NULL"){
                            individualDetail.prerequisites = "None"
                        }
                        courseDetails.push(individualDetail)
                    })
                    // console.log(courseName);
                    res.status(200).render('courseDetailsPage', {
                        courseName: courseName,
                        courseDetails
                    })
                }
            })
        })
    )
}
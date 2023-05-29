module.exports.getCourses = (app, db) => {
    return (
        app.get("/courses", (req, res, next) => {
            const getCourses = `SELECT
                                    Courses.idCourse,
                                    Courses.title,
                                    CONCAT(firstName, ' ', lastName) AS professor,
                                    totalEnrolled,
                                    online,
                                    meetingTime,
                                    CONCAT(building, ' ', roomNumber) AS location
                                FROM
                                    Courses
                                    INNER JOIN Professors ON Professors.idProfessor = Courses.idProfessor
                                    LEFT JOIN Classrooms ON Classrooms.idClassroom = Courses.idClassroom;`

            const getProfessors = ` SELECT
                                        idProfessor,
                                        concat(firstName, ' ', lastName) as profName
                                    FROM Professors;`

            const getClassrooms = ` SELECT
                                        idClassroom,
                                        concat(building, ' ', roomNumber) as location
                                    FROM Classrooms;`

            db.pool.query(getCourses, (err, received, fields) => {
                const courses = []
                if (err) { res.sendStatus(400) }
                else {
                    // console.log(received)
                    received.map(course => {
                        let individualCourse = {
                            idCourse: course.idCourse,
                            title: course.title,
                            professor: course.professor,
                            totalEnrolled: course.totalEnrolled,
                            online: course.online,
                            meetingTime: course.meetingTime,
                            location: course.location
                        }
                        courses.push(individualCourse)
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
                                        courses, professors, classrooms
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
            console.log(form_input);

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
                                            totalEnrolled,
                                            online,
                                            meetingTime,
                                            CONCAT(building, ' ', roomNumber) AS location
                                        FROM
                                            CourseDetails
                                            JOIN Courses ON Courses.title = CourseDetails.title
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
                            totalEnrolled: detail.totalEnrolled,
                            online: detail.online,
                            meetingTime: detail.meetingTime,
                            location: detail.location
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
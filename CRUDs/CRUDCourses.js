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
                    res.status(200).render('coursesPage', {
                        courses
                    })
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
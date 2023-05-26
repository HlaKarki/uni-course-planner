module.exports.getClassrooms = (app, db) => {
    return (
        app.get("/classrooms", (req, res, next) => {
            const getClassrooms = `SELECT * FROM Classrooms;`

            db.pool.query(getClassrooms, (err, received, fields) => {
                const classrooms = []
                if (err) { res.sendStatus(400) }
                else {
                    // console.log(received);
                    received.map(classroom => {
                        let individualClassroom = {
                            idClassroom: classroom.idClassroom,
                            totalSeats: classroom.totalSeats,
                            building: classroom.building,
                            roomNumber: classroom.roomNumber
                        }
                        classrooms.push(individualClassroom)
                    })
                    // console.log(classrooms);
                    res.status(200).render('classroomsPage', {
                        classrooms
                    })
                }
            })
        })
    )
}
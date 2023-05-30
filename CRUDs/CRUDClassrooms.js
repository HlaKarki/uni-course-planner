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

module.exports.addClassroom = (app, db) => {
    return (
        app.post("/addClassroom", (req, res, next) => {
            const form_input = req.body
            // console.log(form_input);
            const addClassroom = `INSERT INTO Classrooms(totalSeats, building, roomNumber) VALUES(${form_input["totalSeats"]}, '${form_input["building"]}', '${form_input["roomNumber"]}');`

            db.pool.query(addClassroom, (err, received, fields) => {
                if (err) { res.sendStatus(400) }
                else {
                    // console.log(received);
                    res.redirect('/classrooms')
                }
            })
        })
    )
}

module.exports.updateClassroom = (app, db) => {
    return (
        app.post("/updateClassroom", (req, res, next) => {
            const form_input = req.body
            // console.log(form_input)
            const updateClassroom = `   UPDATE Classrooms
                                        SET totalSeats = ${parseInt(form_input["updateTotalSeats"], 10)}, building = '${form_input["updateBuilding"]}', roomNumber = ${parseInt(form_input["updateRoomNumber"], 10)}
                                        WHERE idClassroom = ${parseInt(form_input["idClassroom"], 10)};
                                    `

            // console.log(updateClassroom);
            db.pool.query(updateClassroom, (err, received, fields) => {
                if (err) { res.sendStatus(400) }
                else {
                    // console.log(received);
                    res.redirect('/classrooms')
                }
            })
        })
    )
}

module.exports.deleteClassroom = (app, db) => {
    return (
        app.post("/deleteClassroom", (req, res, next) => {
            const form_input = req.body
            const deleteClassroom = `DELETE FROM Classrooms WHERE idClassroom = ${form_input["idClassroomDelete"]};`

            // console.log(deleteClassroom);
            db.pool.query(deleteClassroom, (err, received, fields) => {
                if (err) { res.sendStatus(400) }
                else {
                    // console.log(received);
                    res.redirect('/classrooms')
                }
            })
        })
    )
}
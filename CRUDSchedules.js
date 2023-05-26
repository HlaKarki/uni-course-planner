module.exports.getSchedules = (app, db) => {
    return (
        app.get("/schedules", (req, res, next) => {
            const getSchedules =   `SELECT idSchedule, idStudent, username, totalCreditHours as totalCredits, term
                                    FROM Schedules NATURAL JOIN Students 
                                    ORDER BY (idSchedule);`

            db.pool.query(getSchedules, (err, received, fields) => {
                let schedules = []
                if (err) { res.sendStatus(400) }
                else {
                    received.map(schedule => {
                        let individualSchedule = {
                            idSchedule: schedule.idSchedule,
                            idStudent: schedule.idStudent,
                            username: schedule.username,
                            totalCredits: schedule.totalCredits,
                            term: schedule.term
                        }
                        schedules.push(individualSchedule)
                    })
                    res.status(200).render('schedulesPage', {
                        schedules
                    })
                }
            })

        })
    )
}
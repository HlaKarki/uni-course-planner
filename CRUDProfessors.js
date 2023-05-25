module.exports.getProfessors = function(app, db){
    return (
        app.get('/professors', (req, res, next) => {
            const getProfessors = `SELECT * FROM Professors;`
            const allProfessors = []
            db.pool.query(getProfessors, (err, professors, fields) => {
                let individualProfessor = {}
                professors.map((professor, index) => {
                    individualProfessor = {
                        professorId: parseInt(professor.idProfessor, 10),
                        firstName: professor.firstName,
                        lastName: professor.lastName,
                        email: professor.email
                    }
                    allProfessors.push(individualProfessor)
                })
                // console.log("=== allProfessors after pushing: ", allProfessors);
                res.status(200).render('professorsPage', {
                    allProfessors
                })
            })
        })
    )
}

module.exports.addProfessor = function(app, db){
    return (
        app.post('/addProfessor', async (req, res, next) => {
            const form_input = req.body

            const insertProfessor = `INSERT INTO Professors(firstName, lastName, email) VALUES (?, ?, ?);`

            // console.log(form_input);
            db.pool.query(insertProfessor, [ form_input["firstname"], form_input["lastname"], form_input["email"] ], (err, newProfessors, fields) => {
                if (err){
                    console.log(err);
                    res.sendStatus(400)
                }
                else {
                    res.redirect('/professors')
                }
            })
        })
    )
}

module.exports.updateProfessor = function(app, db){
    return (
        app.post('/updateProfessor', (req, res, next) => {
            const form_input = req.body
            console.log("=== serving /updateProfessors: ", form_input);
            const updateProfessor = `
                                        UPDATE Professors
                                        SET firstName = '${form_input["updateFirstname"]}',
                                            lastName = '${form_input["updateLastname"]}',
                                            email = '${form_input["emailUpdate"]}' 
                                        WHERE idProfessor = '${form_input["idProfessor"]}';
                                    `
            console.log(updateProfessor);
            db.pool.query(updateProfessor, (err, updated, fields)=>{
                if (err) {res.sendStatus(400)}
                else{
                    console.log("=== new updated professors: ", updated);
                    res.redirect('/professors')
                }
            })
        })
    )
}

module.exports.deleteProfessor = function(app, db){
    return (
        app.post('/deleteProfessor', (req, res, next) => {
            const form_input = req.body
            let idProfessor = form_input["professorDelete"]
            const deleteStudent = `DELETE FROM Professors WHERE idProfessor = ${idProfessor};`

            db.pool.query(deleteStudent, (err, professors, fields) => {
                if (err) { res.sendStatus(400)}
                else {
                    // console.log(professors);
                    res.redirect('/professors')
                }
            })
        })
    )
}
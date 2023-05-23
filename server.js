const express = require('express')
const exphbs = require('express-handlebars')

let port = process.env.PORT || 3000
const app = express()

app.engine('handlebars', exphbs.engine({
    defaultLayout: "main"
}))

app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname+'/public/landingPage/index.html')
})

app.get('/student/studentsPage/:studentID', (req, res, next) => {
    console.log("IN HEREEEEEEEEEEEE")
    const student = req.params.studentID
    console.log(student)
    console.log("== Student id: ", student)

    res.status(200).render('studentsPage')
    // res.status(200).sendFile(__dirname+'/views/student/studentsPage.handlebars')
    // res.status(200).render('studentsPage')
})
app.listen(port, (err) => {
    if (err) { throw err }
    console.log("== Server listening on port", port)
})


const express = require('express')
const cookieParser = require('cookie-parser')

const bugService = require('./services/bug-service')
const app = express()
const port = 3030

// Express App Configuration:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => res.send('Hello!'))

// LIST
app.get("/api/bug", (req, res) => {
    const { txt, pageIdx = 0 } = req.query

    const filterBy = {
        txt,
        pageIdx
    }
    bugService
        .query(filterBy)
        .then((bugsAndFilter) => res.send(bugsAndFilter))
        .catch((err) => res.status(500).send("Cannot get bugs"));
})

// CREATE
app.post("/api/bug", (req, res) => {
    const bug = {
        title: req.body.title,
        description: req.body.description,
        severity: +req.body.severity,
        creator: { nickname: req.cookies.nickname }
    }

    bugService
        .save(bug)
        .then((savedBug) => res.send(savedBug))
        .catch((err) => res.status(500).send("Cannot save bug"));
})

// UPDATE
app.put("/api/bug/:bugId", (req, res) => {
    const bug = {
        _id: req.body._id,
        title: req.body.title,
        description: req.body.description,
        severity: +req.body.severity,
        createdAt: +req.body.createdAt,
        creator: { nickname: req.body.creator.nickname }
    }
    if (bug.creator.nickname !== req.cookies.nickname)
        return res.status(401).send('Only the bug creator can update this bug!')

    bugService
        .save(bug)
        .then((savedBug) => res.send(savedBug))
        .catch((err) => res.status(500).send("Cannot save bug"));
})

// READ
app.get("/api/bug/:bugId", (req, res) => {
    const { bugId } = req.params
    bugService.getById(bugId)
        .then(bug => {
            console.log(req.cookies);
            var visitedBugs = req.cookies.visitedBugs ? JSON.parse(req.cookies.visitedBugs) : []
            if (!visitedBugs.some(id => id === bugId))
                visitedBugs.push(bugId)
            console.log('User visited at the following bugs: ' + visitedBugs.join(', '))
            if (visitedBugs.length > 3)
                return res.status(401).send('Wait for a bit')

            res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 7000 })
            return res.send(bug)
        })
        .catch(() => res.status(500).send('Cannot get bug'))
})

// DELETE
app.delete("/api/bug/:bugId", (req, res) => {
    const { bugId } = req.params;
    const { nickname } = req.cookies

    bugService
        .remove(bugId, nickname)
        .then(() => res.send("Removed!"))
        .catch((err) => res.status(500).send("Cannot remove bug"))
})

// Login
app.post("/login", (req, res) => {
    const { nickname } = req.body
    res.cookie('nickname', nickname)
    res.end()
})

//Logout
app.post("/logout", (req, res) => {
    res.clearCookie('nickname')
    res.end()
})

app.listen(port, () => console.log('Server ready at port ' + port))
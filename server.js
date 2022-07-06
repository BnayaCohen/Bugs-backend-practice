const express = require('express')
const cookieParser = require('cookie-parser')

const bugService = require('./services/bug-service')
const userService = require('./services/user-service')
const app = express()
const port = 3030

// Express App Configuration:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => res.send('Hello!'))

// LIST
app.get("/api/bug", (req, res) => {
    const { txt, userId, pageIdx = 0 } = req.query

    const filterBy = {
        txt,
        userId,
        pageIdx
    }
    bugService
        .query(filterBy)
        .then((bugsAndFilter) => res.send(bugsAndFilter))
        .catch((err) => res.status(401).send("Cannot get bugs"));
})

app.get("/api/user", (req, res) => {
    userService
        .query()
        .then((users) => res.send(users))
        .catch((err) => res.status(401).send("Cannot get users"));
})

// CREATE
app.post("/api/bug", (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const bug = {
        title: req.body.title,
        description: req.body.description,
        severity: +req.body.severity,
        creator: loggedinUser
    }

    bugService
        .save(bug)
        .then((savedBug) => res.send(savedBug))
        .catch((err) => res.status(401).send("Cannot save bug"));
})

// UPDATE
app.put("/api/bug/:bugId", (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug')

    const bug = {
        _id: req.body._id,
        title: req.body.title,
        description: req.body.description,
        severity: +req.body.severity,
        createdAt: +req.body.createdAt,
        creator: req.body.creator
    }
    if (bug.creator._id !== loggedinUser._id
        && !loggedinUser.isAdmin)
        return res.status(401).send('Only the bug creator can update this bug!')

    bugService
        .save(bug)
        .then((savedBug) => res.send(savedBug))
        .catch((err) => res.status(401).send("Cannot save bug"));
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
        .catch(() => res.status(401).send('Cannot get bug'))
})

app.get("/api/user/:userId", (req, res) => {
    const { userId } = req.params
    userService.getById(userId)
        .then(user => {
            return res.send(user)
        })
        .catch(() => res.status(401).send('Cannot get user'))
})

// DELETE
app.delete("/api/bug/:bugId", (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot delete bug')

    const { bugId } = req.params;

    bugService
        .remove(bugId, loggedinUser)
        .then(() => res.send("Removed!"))
        .catch((err) => res.status(401).send("Cannot remove bug: " + err))
})

app.delete("/api/user/:userId", (req, res) => {
    const { userId } = req.params;

    bugService.query({ userId, pageIdx: 0 })
        .then(bugsAndFilter => {
            userService
                .remove(userId, bugsAndFilter.bugs)
                .then(() => res.send("Removed!"))
                .catch((err) => res.status(401).send("Cannot remove user: " + err))
        }).catch((err) => res.status(401).send("Cannot remove user"))
})

// USER AUTHENTICATION
app.post('/api/signup', (req, res) => {
    const signupInfo = {
        fullname: req.body.fullname,
        username: req.body.username,
        password: req.body.password
    }

    userService.signup(signupInfo)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
})

app.post('/api/login', (req, res) => {
    const credentials = {
        username: req.body.username,
        password: req.body.password
    }

    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid credentials')
            }
        })
})

app.post('/api/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})

app.listen(port, () => console.log('Server ready at port ' + port))
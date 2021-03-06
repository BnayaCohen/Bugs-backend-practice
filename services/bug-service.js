const fs = require('fs')
const { promises } = require('stream')
const bugs = require('../data/bug.json')

const PAGE_SIZE = 3
module.exports = {
    query,
    getById,
    remove,
    save
}

function query(filterBy) {
    var filteredBugs = bugs
    // Filter by user Id if user Id exists
    if (filterBy.userId) {
        filteredBugs = bugs.filter(bug => bug.creator._id === filterBy.userId)
    }

    // Option to filter by text after the user Id filter
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, "i")
        filteredBugs = filteredBugs.filter(bug => regex.test(bug.title) || regex.test(bug.description))
    }

    filterBy.pageIdx = +filterBy.pageIdx// convert to number after the stringify   [asd,asd,asd,12d,asd] , [,123,asd,12,ad]

    if (filterBy.pageIdx < 0) filterBy.pageIdx = 0

    let startIdx = filterBy.pageIdx * PAGE_SIZE
    if (startIdx > filteredBugs.length - 1) {
        filterBy.pageIdx = 0
        startIdx = 0
    }
    filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
    //all the filtering in the back
    const bugsAndFilter = {
        bugs: filteredBugs,
        filterBy
    }
    return Promise.resolve(bugsAndFilter)
}
function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (bugs[idx].creator._id !== loggedinUser._id
        && !loggedinUser.isAdmin)
        return Promise.reject('Only the bug creator can remove this bug!')
    bugs.splice(idx, 1)
    return _saveBugsToFile().then()
}

function save(bug) {
    if (bug._id) {
        const idx = bugs.findIndex(currBug => currBug._id === bug._id)
        bugs[idx] = bug
    } else {
        bug._id = _makeId()
        bug.createdAt = Date.now()
        bugs.push(bug)
    }
    return _saveBugsToFile()
        .then(() => bug)
}


function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const content = JSON.stringify(bugs, null, 2)
        fs.writeFile('./data/bug.json', content, err => {
            if (err) {
                console.error(err)
                return reject(err)
            }
            resolve()
        })
    })
}
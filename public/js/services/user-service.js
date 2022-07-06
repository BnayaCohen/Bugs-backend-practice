export const userService = {
    query,
    remove,
    getById,
    signup,
    login,
    logout,
    getLoggedInUser,
}

const STORAGE_KEY = "loggedinUser";

function query() {
    return axios.get('/api/user').then((res) => res.data)
}

function remove(userId) {
    return axios.delete('/api/user/' + userId).then((res) => res.data)
}

function getById(userId) {
    return axios.get('/api/user/' + userId).then(res => res.data)
}

function signup(signupInfo) {
    return axios.post('/api/signup', signupInfo)
        .then(res => res.data)
        .then(user => {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
            return user
        })
}

function login(credentials) {
    return axios.post('/api/login', credentials)
        .then(res => res.data)
        .then(user => {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
            return user
        })
}

function logout() {
    return axios.post('/api/logout').then(() => {
        sessionStorage.removeItem(STORAGE_KEY)
    })
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY))
}
export const userService = {
    logIn,
    logOut,
    getLoggedInUser,
};

const STORAGE_KEY = "user";
var gUser = null

function logIn(nickname) {
    gUser = { nickname }
    return axios.post('/login', gUser).then(() => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nickname))
    })
}

function logOut() {
    return axios.post('/logout').then(() => {
        sessionStorage.removeItem(STORAGE_KEY);
        gUser = null
    })
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY))
}
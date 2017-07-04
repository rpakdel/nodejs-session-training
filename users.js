let users = {}

function getUser(username) {
    let p = users[username]
    return p
}

function addUser(username, fullname, age) {
    users[username] = {
        username,
        fullname,
        age,
        isloggedin: false
    }
}

addUser("rpakdel", "Reza Pakdel", 39)
addUser("mperdomo", "Maria Perdomo", 38)

module.exports = {
    getUser,
    addUser
}
let isLoggedIn = false
let isNewUserMode = false

function logInUser() {
    if (isLoggedIn) {
        console.log("Already logged in")
        return
    }

    let el = document.getElementById("usernameInput")
    let username = el.value
    fetch("/api/login/" + username, { method: "GET", credentials: "include" })
        .then(res => {
            if (res.ok) {
                isLoggedIn = true
                console.log("Logged in")
            } else {
                console.log("Login failed" + res.err)
            }
            setUIState(isLoggedIn)
            showUserInfo()
        })
        .catch(err => console.log(err))
}

function logOutUser() {
    if (!isLoggedIn) {
        console.log("Not logged in")
        return
    }

    fetch("/api/logout", { method: "GET", credentials: "include" })
        .then(res => {
            if (res.ok) {
                isLoggedIn = false
                console.log("Logged out")
            } else {
                console.log("Logout failed" + res.err)
            }
            setUIState(isLoggedIn)
            showUserInfo()
        })
        .catch(err => console.log(err))
}

function logInOrLogOutUser() {
    if (isLoggedIn) {
        logOutUser()
    } else {
        logInUser()
    }
}

function setUIState(loggedIn) {
    let buttonEl = document.getElementById("loginButton")
    let nameEl = document.getElementById("usernameInput")
    let newUserLinkEl = document.getElementById("showNewUserFormLink")

    if (loggedIn) {
        buttonEl.value = "Log Out"
        nameEl.disabled = true
        newUserLinkEl.style.visibility = "hidden"
    } else {
        buttonEl.value = "Log In"
        nameEl.disabled = false
        newUserLinkEl.style.visibility = "visible"
    }
    setNewUserUIState(loggedIn)
}

function setNewUserUIState(loggedIn) {
    let newUserFormEl = document.getElementById("newUserForm")
    if (loggedIn) {
        newUserFormEl.style.visibility = "collapse"
        return
    }

    let buttonEl = document.getElementById("loginButton")
    let newUserLinkEl = document.getElementById("showNewUserFormLink")
    if (isNewUserMode) {
        newUserFormEl.style.visibility = "visible"
        buttonEl.style.visibility = "collapse"
        newUserLinkEl.style.visibility = "collapse"
    } else {
        newUserFormEl.style.visibility = "collapse"
        buttonEl.style.visibility = "visible"
        newUserLinkEl.style.visibility = "visible"
    }
}

function checkLogin() {
    fetch("/api/user/isloggedin", { method: "GET", credentials: "include" })
        .then(res => {
            if (res.status === 200) {
                isLoggedIn = true
                console.log("Already logged in")
            } else {
                isLoggedIn = false
                console.log("Not logged in")
            }
            setUIState(isLoggedIn)
            showUserInfo()
        })
        .catch(err => console.log(err))
}



function showUserInfo() {
    let usernameEl = document.getElementById("usernameInput")
    let resultEl = document.getElementById("result")

    if (!isLoggedIn) {
        resultEl.innerText = "Not logged in"
        return
    }

    fetch("/api/user/info", { method: "GET", credentials: "include" })
        .then(res => {
            if (res.ok) {
                res.json().then(u => {
                    usernameEl.value = u.username
                    resultEl.innerText = JSON.stringify(u)
                })
            } else {
                el.innerText = "Failed to get user info"
            }
        })
        .catch(err => el.innerText = err.toString())
}

function enableNewUserMode() {
    if (isNewUserMode) {
        return
    }

    isNewUserMode = true
    setNewUserUIState(isLoggedIn)
}

function disableNewUserMode() {
    if (!isNewUserMode) {
        return
    }

    isNewUserMode = false
    setNewUserUIState(isLoggedIn)
}

function createNewUser() {
    if (!isNewUserMode) {
        return
    }

    let username = document.getElementById("usernameInput").value
    let fullname = document.getElementById("fullnameInput").value
    let age = document.getElementById("ageInput").value

    let userData = {
        username,
        fullname,
        age
    }

    let bodyStr = JSON.stringify(userData)
    fetch("/api/user/" + username, {
            method: "PUT",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: bodyStr
        })
        .then(res => {
            if (res.ok) {
                disableNewUserMode()
                logInUser()
            } else {
                console.log("Registration failed" + res.err)
            }
        })
        .catch(err => console.log(err))


}


checkLogin()
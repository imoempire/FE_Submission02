
// Login user check
async function Login(event) {
    sessionStorage.clear;
    // Validation of inputs
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    if (username == '') {
        alert("Username is required");
    }
    else if (password == '') {
        alert("Password is required");
    }
    else if (password.length < 5) {
        alert("Password must at least be 8 characters long");
    }
    else {
        const payload = {
            "username": username,
            "password": password
        }
        const response = await fetch('https://freddy.codesubmit.io/login', {
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        sessionStorage.setItem("access_token", data.access_token);
        sessionStorage.setItem("refresh_token", data.refresh_token);
        if (sessionStorage.getItem("access_token")) {
            alert('Login Successful');
            window.setTimeout(
                function () {
                    window.location = "./dashboard.html";
                    window.location.href(`${window.location}`);
                }, 2000);
            
            return false;
        } else if (data.msg) {
            alert(data.msg);
        } else {
            alert("Username/Password is incorrect");
        }

    }
}
const login = document.querySelector("#login");
login.addEventListener('click', Login);
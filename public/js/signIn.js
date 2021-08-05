console.log("signIn.js running!");

var SHA512 = new Hashes.SHA512;

const signInButton = document.querySelector("#signInButton");
const signInGoogleButton = document.querySelector("#signInGoogleButton");
const signIn = document.querySelector("#signIn");

var googleUser;
const signInGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
        //show pop-up window for sign in, return promise
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            // var to store in cookies
            googleUser = result.user.uid;
            // store in cookies
            // sessionStorage.setItem("KEY", "VALUE");
            sessionStorage.setItem("userId", googleUser);
            const dbRef = firebase.database().ref(`users/`);
            dbRef.on('value', (snapshot) => {
                let count = 0;
                const data = snapshot.val();
                console.log(data);
                for (let key in data) {
                    if(key == googleUser) {
                        window.location = "home.html";
                        console.log("matches found");
                        count ++;
                    }
                }
                // If no matches found, alert, clear inputs
                if (count == 0) {
                    console.log("no matches");
                    securityGoogle();
                }
            })              
            //check if returning or new user
            //if (dbRef != null) {
            //    window.location = "home.html";
            //} else {
                //redirect to security
            //    window.location = "index.html";
            //    securityGoogle();
            //}
        })
        .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            console.log("I'M BROKE!");
            console.log(errorCode);
            console.log(errorMessage);
        });
}

const logIn = () => {
    const userField = document.querySelector("#username");
    const myUser = userField.value;
    const passField = document.querySelector("#password");
    const myPass = passField.value;

    const dbRef = firebase.database().ref("users/");

    dbRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const count = 0;
        for(let user in data) {
            const info = data[user];
            if(info.security != null && info.security.username != null) {
                if(myUser==info.security.username && SHA512.hex(myPass)==info.security.password) {
                    // var to store in cookies
                    var userId = user;
                    // store in cookies
                    // sessionStorage.setItem("KEY", "VALUE");
                    sessionStorage.setItem("userId", userId);
                    //redirect to home page
                    window.location = "home.html";
                    count ++;
                }
            }
        }
        if(count == 0) {
            userField.value = "";
            userField.placeholder = "Bad username";
            passField.value = "";
            passField.placeholder = "or bad password";
        }
    })
}

var username;
var password;
const signUp = () => {
    username = document.querySelector("#username").value;
    password = document.querySelector("#password").value;
    if (/\d/g.test(password) && /[A-Z]/g.test(password)) {
        let form = `<div class="authField">
                        <label class="label index-label has-text-left">To store passwords, please select a security question or select 'Access Key'.</label>
                        <div class="control">
                            <select class="input" id="questions" required>
                                <option value="" disabled selected hidden>
                                    Click to select.
                                </option>
                                <option value="What street did you grow up on?">
                                    What street did you grow up on?
                                </option>
                                <option value="What was the name of your first pet?">
                                    What was the name of your first pet?
                                </option>
                                <option value="What is your mother's maiden name?">
                                    What is your mother's maiden name?
                                </option>
                                <option value="What was the model of your first car?">
                                    What was the model of your first car?
                                </option>
                                <option value="Access Key">
                                    Access Key
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="authField">
                        <label class="label index-label has-text-left">Enter your response.</label>
                        <div class="control">
                            <input class="input is-medium" type="text" id="response" placeholder="response">
                        </div>
                    </div>
                    <div class="authField">
                        <div class="control">
                            <button id="submitSecurityBtn" class="button font signIn-button is-rounded is-fullwidth has-text-weight-medium is-medium is-outlined">Submit</button>
                        </div>
                    </div>
                    <p id="back" class="has-text-centered">
                        <a id="backButton" class="index-link" onclick="showSignUp()">
                            Go Back
                        </a>
                    </p>`;
        signIn.innerHTML = form;
        const submitSecurityBtn = document.querySelector("#submitSecurityBtn");
        submitSecurityBtn.addEventListener('click', submitSecurity);        
    } else {
        alert("Password must contain at least one capital letter and number.");
    }
}

const submitSecurity = () => {
    console.log("security submitted!");
    const question = document.querySelector("#questions").value;
    const response = document.querySelector("#response").value;
    const hashedResponse = SHA512.hex(response);
    const hashedPass = SHA512.hex(password);

    const dbRef = firebase.database().ref('users/');
    dbRef.push({
        security: {username: username,
        password: hashedPass,
        question: question,
        response: hashedResponse}
    })
    alert("Success! Please log in with your username and password to continue.");
    signInAccount();
}

const securityGoogle = () => {
    console.log('securityGoogle() running!');
    let form =      `<div class="authField">
                        <label class="label index-label has-text-left">To store passwords, please select a security question or select 'Access Key'.</label>
                        <div class="control">
                            <select class="input" id="questions" required>
                                <option value="" disabled selected hidden>
                                    Click to select.
                                </option>
                                <option value="What street did you grow up on?">
                                    What street did you grow up on?
                                </option>
                                <option value="What was the name of your first pet?">
                                    What was the name of your first pet?
                                </option>
                                <option value="What is your mother's maiden name?">
                                    What is your mother's maiden name?
                                </option>
                                <option value="What was the model of your first car?">
                                    What was the model of your first car?
                                </option>
                                <option value="Access Key">
                                    Access Key
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="authField">
                        <label class="label index-label has-text-left">Enter your response.</label>
                        <div class="control">
                            <input class="input is-medium" type="text" id="response" placeholder="response">
                        </div>
                    </div>
                    <div class="authField">
                        <div class="control">
                            <button id="submitSecurityBtn" class="button font signIn-button is-rounded is-fullwidth has-text-weight-medium is-medium is-outlined">Submit</button>
                        </div>
                    </div>
                    <p id="back" class="has-text-centered">
                        <a id="backButton" class="index-link" onclick="signInGoogle()">
                            Go Back
                        </a>
                    </p>`;
    signIn.innerHTML = form;
    const submitSecurityBtn = document.querySelector("#submitSecurityBtn");
    submitSecurityBtn.addEventListener('click', submitSecurityGoogle); 
}

const submitSecurityGoogle = () => {
    console.log("security submitted!");
    const question = document.querySelector("#questions").value;
    const response = document.querySelector("#response").value;
    const hashedResponse = SHA512.hex(response);

    const dbRef = firebase.database().ref(`users/${googleUser}`);
    dbRef.push({
        question: question,
        response: hashedResponse
    })
    alert("Success!");
    window.location = "home.html";
}

const showSignUp = () => {
    let form = `<div class="authField">
                    <label class="label index-label has-text-left">Create a Username</label>
                    <div class="control">
                        <input class="input is-medium" type="text" id="username" placeholder="username">
                    </div>
                  </div>
                  <div class="authField">
                    <label class="label index-label has-text-left">Create a Password</label>
                    <div class="control">
                        <input class="input is-medium" type="password" id="password" placeholder="password">
                    </div>
                  </div>
                  <div class="authField">
                    <div class="control">
                        <button id="submitSignUp" class="button font signIn-button is-rounded is-fullwidth has-text-weight-medium is-medium is-outlined">Sign Up</button>
                    </div>
                  </div>
                  <p id="logIn" class="has-text-centered">
                    <a id="logInButton" class="index-link" onclick="signInAccount()">
                        Log In
                    </a>
                  </p>`;
    signIn.innerHTML = form;
    const submitSignUp = document.querySelector("#submitSignUp");
    submitSignUp.addEventListener('click', signUp);
}

const signInAccount = () => {
    let form = `<div class="authField">
                    <label class="label index-label has-text-left">Username</label>
                    <div class="control">
                        <input class="input is-medium" type="text" id="username" placeholder="username">
                    </div>
                  </div>
                  <div class="authField">
                    <label class="label index-label has-text-left">Password</label>
                    <div class="control">
                        <input class="input is-medium" type="password" id="password" placeholder="password">
                    </div>
                  </div>
                  <div class="authField">
                    <div class="control">
                        <button id="submitLogIn" class="button font signIn-button is-rounded is-fullwidth has-text-weight-medium is-medium is-outlined">Log In</button>
                    </div>
                  </div>
                  <p id="createAccount" class="has-text-centered">
                    <a id="signUpButton" class="index-link" onclick="showSignUp()">
                        Create Account
                    </a>
                  </p>`;
    signIn.innerHTML = form;
    const submitLogIn = document.querySelector("#submitLogIn");
    submitLogIn.addEventListener('click', logIn);
}

signInGoogleButton.addEventListener('click', signInGoogle);
signInButton.addEventListener('click', signInAccount);

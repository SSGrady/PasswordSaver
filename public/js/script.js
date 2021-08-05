//THINGS TO ADD: 1) do not allow category & password inputs to be empty [DONE]
//               2) initially show characters as user types accessKey, but hide as dots after ~1 sec.
//               3) consider character limit for password/accessKey (check if hashes are limited lengths)
//               4) communicate to user if password and info were saved successfully
const burger = document.querySelector('.burger');
const nav = document.querySelector('#'+burger.dataset.target);

burger.addEventListener('click', (e) => {
  burger.classList.toggle('is-active'); //displays the 'x' to close nav burger
  nav.classList.toggle('is-active'); //displays nav-menu.is-active
});

console.log("signIn.js running!");

var SHA512 = new Hashes.SHA512;

const signInButton = document.querySelector("#signInButton");
const signInGoogleButton = document.querySelector("#signInGoogleButton");
const signIn = document.querySelector("#signIn");

const signInGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
        //show pop-up window for sign in, return promise
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
            document.querySelector("#signInGoogleButton").innerHTML = credential;
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            // var to store in cookies
            var user = result.user.uid;
            // store in cookies
            // sessionStorage.setItem("KEY", "VALUE");
            sessionStorage.setItem("userId", user);
            //redirect to home page
            window.location = "home.html";
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
            if(myUser==info.username && SHA512.hex(myPass)==info.password) {
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
        if(count == 0) {
            userField.value = "";
            userField.placeholder = "Bad username";
            passField.value = "";
            passField.placeholder = "or bad password";
        }
    })
}

const signUp = () => {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    if (/\d/g.test(password) && /[A-Z]/g.test(password)) {
        const hashedPass = SHA512.hex(password);

        const dbRef = firebase.database().ref('users/');
        dbRef.push({
            username: username,
            password: hashedPass
        })
        signInAccount();
    } else {
        alert("Password must contain at least one capital letter and number.");
    }
}

const showSignUp = () => {
    let form = `<div class="authField">
                    <label class="label has-text-left">Create a Username</label>
                    <div class="control">
                        <input class="input is-medium" type="text" id="username" placeholder="username">
                    </div>
                  </div>
                  <div class="authField">
                    <label class="label has-text-left">Create a Password</label>
                    <div class="control">
                        <input class="input is-medium" type="text" id="password" placeholder="password">
                    </div>
                  </div>
                  <div class="authField">
                    <div class="control">
                        <button id="submitSignUp" class="button signIn-button is-link is-rounded is-fullwidth has-text-weight-medium is-medium">Sign Up</button>
                    </div>
                  </div>
                  <p id="logIn" class="has-text-centered">
                    <a id="logInButton" class="auth-link">
                        Log In
                    </a>
                  </p>`;
    signIn.innerHTML = form;
    const submitSignUp = document.querySelector("#submitSignUp");
    submitSignUp.addEventListener('click', signUp);
    const logInButton = document.querySelector("#logInButton");
    logInButton.addEventListener('click', signInAccount);
}

const signInAccount = () => {
    let form = `<div class="authField">
                    <label class="label has-text-left">Username</label>
                    <div class="control">
                        <input class="input is-medium" type="text" id="username" placeholder="username">
                    </div>
                  </div>
                  <div class="authField">
                    <label class="label has-text-left">Password</label>
                    <div class="control">
                        <input class="input is-medium" type="text" id="password" placeholder="password">
                    </div>
                  </div>
                  <div class="authField">
                    <div class="control">
                        <button id="submitLogIn" class="button signIn-button is-rounded is-fullwidth has-text-weight-medium is-medium">Log In</button>
                    </div>
                  </div>
                  <p id="createAccount" class="has-text-centered">
                    <a id="signUpButton" class="auth-link">
                        Create Account
                    </a>
                  </p>`;
    signIn.innerHTML = form;
    const submitLogIn = document.querySelector("#submitLogIn");
    submitLogIn.addEventListener('click', logIn);
    const signUpButton = document.querySelector("#signUpButton");
    signUpButton.addEventListener('click', showSignUp);
}

signInGoogleButton.addEventListener('click', signInGoogle);
signInButton.addEventListener('click', signInAccount);

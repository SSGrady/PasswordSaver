//THINGS TO ADD: 1) do not allow category & password inputs to be empty [DONE]
//               2) initially show characters as user types accessKey, but hide as dots after ~1 sec.
//               3) consider character limit for password/accessKey (check if hashes are limited lengths)
//               4) communicate to user if password and info were saved successfully

console.log("script running");

const userId = sessionStorage.getItem("userId");
console.log(userId);

var SHA512 = new Hashes.SHA512;

const passwordInput = document.querySelector("#passwordInput");
//const accessKeyInput = document.querySelector("#accessKeyInput");
const categoryInput = document.querySelector("#categoryInput");
const submitBtn = document.querySelector("#submitBtn");
const burger = document.querySelector('.burger');
const nav = document.querySelector('#'+burger.dataset.target);

burger.addEventListener('click', (e) => {
  burger.classList.toggle('is-active'); //displays the 'x' to close nav burger
  nav.classList.toggle('is-active'); //displays nav-menu.is-active
})

submitBtn.addEventListener('click', (e) => {
    const password = passwordInput.value;
    //const accessKey = accessKeyInput.value;
    const category = categoryInput.value;

    console.log(password);
    //console.log(accessKey);
    console.log(category);

    //Uses SHA512 hash with hexadecimal hash encoding
    //const hashedKey = SHA512.hex(accessKey);

    //checks for non-empty password, category, and access key with numbers & capital letters
    //const accessHasNum = /\d/g.test(accessKey);
    //const accessHasCap = /[A-Z]/g.test(accessKey);

    let error = "";
    if (password=="") {
        error += "Please enter a password.\n"
    }
    if (category=="") {
        error += "Please enter a category.\n"
    }
    /*if (!accessHasNum && !accessHasCap) {
        error += "Your access key must contain a capital letter and number.";
    } else if (!accessHasNum) {
        error += "Your access key must contain a number.";
    }
    else if (!accessHasCap) {
        error += "Your access key must contain a capital letter."
    }*/

    console.log(error);

    if(error == "") {
        console.log(userId);
        firebase.database().ref(`users/${userId}/data`).push({
            password: password,
            //accessKey: hashedKey,
            category: category
        })
        //clear input fields
        passwordInput.value = "";
        //accessKeyInput.value = "";
        categoryInput.value = "";
    } else {
        alert(error);
    }
})
console.log("view.js running!");

var userId = sessionStorage.getItem("userId");

const SHA512 = new Hashes.SHA512();

const accessKeyInput = document.querySelector("#accessKeyInput");
const categoryInput = document.querySelector("#categoryInput");  //may change this to a dropdown
const submitBtn = document.querySelector("#submitBtn"); 
const burger = document.querySelector('.burger');
const nav = document.querySelector('#'+burger.dataset.target);
const securityQuesDiv = document.querySelector("#securityQuestion");
const dbRef = firebase.database().ref(`users/${userId}`);

burger.addEventListener('click', (e) => {
  burger.classList.toggle('is-active'); //displays the 'x' to close nav burger
  nav.classList.toggle('is-active'); //displays nav-menu.is-active
})

dbRef.on('value', (snapshot) => {
    const userData = snapshot.val();
    for (let key in userData) {
        if (key != "data") {
            const question = userData[key].question;
            console.log(userData[key]);
            securityQuesDiv.innerHTML = question;
            break;
        }
    }
})

submitBtn.addEventListener('click', (e) => {
    const accessKey = accessKeyInput.value;
    const category = categoryInput.value;

    console.log(accessKey);

    //check that access key contains capital letters & numbers
    //if(/\d/g.test(accessKey) && /[A-Z]/g.test(accessKey)) {
        //Uses SHA512 hash with hexadecimal hash encoding
        const hashedKey = SHA512.hex(accessKey);
        // check that hashed key matches with key in database
        dbRef.on('value', (snapshot) => {
            let count = 0;
            const userData = snapshot.val();
            for (let key in userData) {
                if (key != "data") {
                    if (hashedKey != userData[key].response) {
                        alert("No matching passwords found. Try again!");
                        accessKeyInput.value = "";
                        categoryInput.value = "";
                        return;
                    }
                } else {
                    const info = userData[key];
                    for (let password in info) {
                        if(category == info[password].category) {
                            displayPassword(info[password]);
                            count ++;
                        }
                    }
                }
            }
            // If no matches found, alert, clear inputs
            if (count == 0) {
                alert("Sorry! No matching passwords found.");
                accessKeyInput.value = "";
                categoryInput.value = "";
            }
        })
    //form validation
    /*} else {
        alert("Your access key must contain a capital letter and number");
    }*/
})

const displayPassword = (info) => {
    const displayDiv = document.querySelector("#display");
    displayDiv.innerHTML = info.password;
}
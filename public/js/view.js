console.log("view.js running!");

var userId = sessionStorage.getItem("userId");

const SHA512 = new Hashes.SHA512();

const accessKeyInput = document.querySelector("#accessKeyInput");
const categoryInput = document.querySelector("#categoryInput");  //may change this to a dropdown
const submitBtn = document.querySelector("#submitBtn"); 
const burger = document.querySelector('.burger');
const nav = document.querySelector('#'+burger.dataset.target);

burger.addEventListener('click', (e) => {
  burger.classList.toggle('is-active'); //displays the 'x' to close nav burger
  nav.classList.toggle('is-active'); //displays nav-menu.is-active
})

submitBtn.addEventListener('click', (e) => {
    const accessKey = accessKeyInput.value;
    const category = categoryInput.value;

    console.log(accessKey);

    //check that access key contains capital letters & numbers
    if(/\d/g.test(accessKey) && /[A-Z]/g.test(accessKey)) {
        //Uses SHA512 hash with hexadecimal hash encoding
        const hashedKey = SHA512.hex(accessKey);
        // check that hashed key matches with key in database
        // NOTE: this will return all passwords saved with the same access key
        const dbRef = firebase.database().ref(`users/${userId}/data`);
        dbRef.on('value', (snapshot) => {
            let count = 0;
            const data = snapshot.val();
            for (let key in data) {
                const info = data[key];
                console.log(hashedKey);
                console.log(info);
                if(hashedKey == info.accessKey && category == info.category) {
                    displayPassword(info);
                    count ++;
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
    } else {
        alert("Your access key must contain a capital letter and number");
    }
})

const displayPassword = (info) => {
    const displayDiv = document.querySelector("#display");
    displayDiv.innerHTML = info.password;
}
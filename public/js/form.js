// For Form Validation
console.log('JS connected'); //test
const fullname = document.getElementById('name');
const phone = document.getElementById('phone');
const email = document.getElementById('email');

const address = document.getElementById('address');
const state = document.getElementById('state');
const city = document.getElementById('city');
const zip = document.getElementById('zip');

const direction = document.getElementById('direction');
// For gathering user input via the DOM.

let nameError = document.getElementById('nameError');
let phoneError = document.getElementById('phoneError');
let emailError = document.getElementById('emailError');

let locationError = document.getElementById('locationError');
let directionError = document.getElementById('directionError');

const form = document.getElementById('contact');

// Regex to check for valid inputs.
const emailRegex =
    /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/i;
const phoneRegex = /^(?:\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4}))$/;
const nameRegex = /^[a-zA-Z\s'-]+$/;
const addressRegex = /^(?=.*\d)[A-Za-z0-9 .,'\-#]{5,100}$/;
const commentRegex = /^(?=.*[\p{L}\p{N}])[\p{L}\p{N}\s'.,!?()"%-:;]{1,300}$/u;

//Setting valid inputs as false by default.
let nameValid = false;
let phoneValid = false;
let emailValid = false;

let locationValid = false;
let directionValid = false;

const userInput = {
    fullnameInput: '',
    phoneInput: '',
    emailInput: '',

    addressInput: '',
    stateInput: '',
    cityInput: '',
    zipInput: '',

    directionInput: '',
};

const jsonString = JSON.stringify(userInput);
// const document.getElementById('form-popup')

function validation() {
    // For each section of the form, regexs were used to check, as well as blank inputs; else the result will be true.
    if (!emailRegex.test(email.value.trim()) || email.value.trim() == '') {
        emailError.textContent = 'Valid email address is required.'; //Error messages will pop up on invalid entry.
        emailValid = false;
    } else {
        emailError.textContent = '';
        emailValid = true;
    }

    if (!phoneRegex.test(phone.value.trim()) || phone.length < 10) {
        phoneError.innerHTML = 'Valid phone number is required.';
        phoneValid = false;
    } else {
        phoneError.innerHTML = '';
        phoneValid = true;
    }

    if (
        !nameRegex.test(fullname.value.trim()) ||
        fullname.length < 2 ||
        fullname.length > 20
    ) {
        nameError.innerHTML = 'Valid name is required.';
        nameValid = false;
    } else {
        nameError.innerHTML = '';
        nameValid = true;
    }
    // JSON check the states & cities. double check locations basically & validate only numbers & strings for directions (TO DO LATER.) -  in addition, fix address regex.
    if (
        !addressRegex.test(address.value.trim()) ||
        address.value == '' ||
        state.value == '' ||
        state.value.length < 2 ||
        city.value == '' ||
        zip.value == '' ||
        zip.value.length < 5
    ) {
        locationError.innerHTML = 'Please enter a valid location.';
        locationValid = false;
    } else {
        locationError.innerHTML = '';
        locationValid = true;
    }

    if (
        !commentRegex.test(direction.value.trim()) ||
        direction.value == '' ||
        direction.value.length < 10
    ) {
        directionError.innerHTML =
            'Please enter at least 10 characters. Only letters and numbers.';
        directionValid = false;
    } else {
        directionError.innerHTML = '';
        directionValid = true;
    }
}

// FORM VALIDATION - INCLUDE REGEX & DROP DOWN.
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    validation();
    if (
        emailValid == false ||
        nameValid == false ||
        phoneValid == false ||
        locationValid == false ||
        directionValid == false
    ) {
        console.log('form info is not valid');
        return;
    } else {
        console.log('Successful form submission.');

        userInput.fullnameInput = `${fullname.value}`;
        userInput.phoneInput = `${phone.value}`;
        userInput.emailInput = `${email.value}`;

        userInput.addressInput = `${address.value}`;
        userInput.stateInput = `${state.value}`;
        userInput.cityInput = `${city.value}`;
        userInput.zipInput = `${zip.value}`;

        userInput.directionInput = `${direction.value}`;
        // console.log(userInput);
        // Sending successful submission & its data to the backend server.
        try {
            const res = await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userInput),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || `Request failed: ${res.status}`);
            }

            const data = await res.json();
            console.log('Server accepted:', data);

            fullname.value = '';
            phone.value = '';
            email.value = '';

            address.value = '';
            state.value = '';
            city.value = '';
            zip.value = '';

            direction.value = ''; // check for server validaton just in case of a SQL injecition getting through.
        } catch (e) {
            console.error('Send failed:', e);
            alert(e.message || 'Could not send data. Try again.');
        }
    }
});

// form-popup.addEventListener including logic for the form pop up.

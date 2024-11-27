const signUpButton = document.getElementById("signUpButton");
const signInButton = document.getElementById("signInButton");
const signInForm = document.getElementById("signIn");
const signUpForm = document.getElementById("signup");

// Toggle between Sign In and Sign Up
signUpButton.addEventListener("click", function () {
  signInForm.style.display = "none";
  signUpForm.style.display = "block";
});

signInButton.addEventListener("click", function () {
  signInForm.style.display = "block";
  signUpForm.style.display = "none";
});

// Gender Selection Logic
const genderSelect = document.getElementById("gender");
const signUpButtonElement = document.getElementById("signUpButton");

genderSelect.addEventListener("change", function () {
  console.log("Gender selected: ", genderSelect.value); // Debugging log
  
  if (genderSelect.value == "male") {
    signUpButtonElement.disabled = true; // Disable Sign Up button for males
    displayErrorMessage("Access denied. Only females can sign up.");
  } else {
    signUpButtonElement.disabled = true; // Enable Sign Up button for females
    clearErrorMessage();
  }
});

// Sign-Up Logic
const signUpFormElement = document.querySelector("#signup form");

signUpFormElement.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const gender = document.getElementById("gender").value;
  const type = document.getElementById("type").value;

  // Prevent form submission if gender is Male
  if (gender == "male") {
    console.log("Male selected, form submission blocked.");
    return; // Prevent form submission if gender is Male
  }

  // Proceed with Firebase logic if user is Female
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const userId = userCredential.user.uid;
      const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        gender: gender,
        type: type,
      };

      // Save data in Firebase Realtime Database or Firestore
      firebase
        .database()
        .ref("users/" + userId)
        .set(userData)
        .then(() => {
          displaySuccessMessage("User signed up successfully.");
          signUpFormElement.reset(); // Reset the form
          signInButton.click(); // Switch to Sign-In form
        })
        .catch((error) => {
          displayErrorMessage("Failed to save user data: " + error.message);
        });
    })
    .catch((error) => {
      displayErrorMessage("Sign-Up Error: " + error.message);
    });
});

// Helper Functions to Display Messages
function displayErrorMessage(message) {
  const messageDiv = document.querySelector(".messageDiv");
  messageDiv.classList.add("error");
  messageDiv.textContent = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

function clearErrorMessage() {
  const messageDiv = document.querySelector(".messageDiv");
  messageDiv.classList.remove("error");
  messageDiv.textContent = "";
}

function displaySuccessMessage(message) {
  const messageDiv = document.querySelector(".messageDiv");
  messageDiv.classList.remove("error");
  messageDiv.classList.add("success");
  messageDiv.textContent = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

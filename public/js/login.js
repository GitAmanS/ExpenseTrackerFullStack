// const signUp = document.getElementById("signUp");
// const signIn = document.getElementById("signIn");
// const container = document.getElementById("container");
const signUpBtn = document.getElementById("signUpBtn");
const loginBtn = document.getElementById("loginBtn");

const wrapper = document.querySelector(".wrapper"),
          signupHeader = document.querySelector(".signup header"),
          loginHeader = document.querySelector(".login header");

loginHeader.addEventListener("click", () => {
          wrapper.classList.add("active");
        });        
        signupHeader.addEventListener("click", () => {
          wrapper.classList.remove("active");
        });       

async function loginForm(e) {
  e.preventDefault(); // Prevent the default form submission behavior
  const email = e.target.loginEmail.value;
  const password = e.target.loginPassword.value;

  try {
    const response = await axios.post("/user/login", {
      email,
      password,
    });

    if (response.status === 200) {
      alert("login successful");
      localStorage.setItem("token", response.data.token);

      window.location.href = "../views/expensePage.html";
    }
  } catch (error) {
    console.log(error);

    if (error.response.status === 404) {
      let unsuccessful = document.getElementById("loginunSuccessfull");
      unsuccessful.innerHTML = "User not found";
      document.getElementById("loginEmail").value = "";
      document.getElementById("loginPassword").value = ""; // Clear the password field as well
    }

    if (error.response.status === 401) {
      let unsuccessful = document.getElementById("loginunSuccessfull");
      unsuccessful.innerHTML = "User not authorized";
    }
  }
}

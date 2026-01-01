
document.addEventListener("DOMContentLoaded", function() {
    const inputs = document.querySelectorAll(".inp input");

    inputs.forEach(input => {
    input.addEventListener("input", function() {
      const label = this.nextElementSibling;
      label.classList.toggle("up", this.value.trim() !== "");
    });
   });
});

function focusinp(inp) {
if (inp == 'usr') {
document.getElementById("username").focus();
} else if (inp == 'pass') {
document.getElementById("password").focus();
} else {
document.getElementById("username").focus();
}
}

const email = document.getElementById("email")
const error1 = document.getElementById("error1")

const password = document.getElementById("password")
const error2 = document.getElementById("error2")

function emailValidator(){
  const email1 = email.value;
  const pattern = /^([a-zA-Z0-9._-]+)@([a-zA-Z.-]+).([a-zA-z]{2,4})$/ 
  if(email1.trim()==""){
      error1.style.display = "block";
      error1.innerHTML = "<span>*</span>Email-id should not be empty!"
      const star = error1.firstElementChild;
      star.style.color = "red";
      return;
  }
  if(!pattern.test(email1)){
      error1.style.display = "block";
      error1.innerHTML = "<span>*</span>Enter a valid Id!"
      const star = error1.firstElementChild;
      star.style.color = "red";
  }
  else{
      error1.style.display = "none";
      error1.innerHTML = "";
  }
}
email.addEventListener("blur",emailValidator);

function passwordValidator(){
  const password1 = password.value;
  const digitPattern = /\d/
  const alphaPattern = /[a-zA-Z]/
  const symbolPattern = /[!@#$%^&*()_~`+={}|:";<>?/*.,']|[\[\]\-\+]/  
  if(password1.trim()==""){
      error2.style.display = "block";
      error2.innerHTML = "<span>*</span>Password cannot be empty!";
      const star = error2.firstElementChild;
      star.style.color = "red";
      return;
  }
  if(!digitPattern.test(password1) || !alphaPattern.test(password1) || !symbolPattern.test(password1)){
      error2.style.display = "block";
      error2.innerHTML = "<span>*</span>Password should have atleast 1 special character,<br> 1 number and an alphabet and must have more than 6 characters!";
      const star = error2.firstElementChild;
      star.style.color = "red";
      return;
  }
  else if(password1.length<5){
      error2.style.display = "block";
      error2.innerHTML = "<span>*</span>Password should have more than 6 characters!";
      const star = error2.firstElementChild;
      star.style.color = "red";
      return;
  }
  else{
      error2.style.display = "none";
      error2.innerHTML = ""
  }
}
password.addEventListener("blur",passwordValidator);

form.addEventListener("submit",function(event){
    error1.textContent = error2.textContent = error3.textContent = error4.textContent = "";
    nameValidator(); emailValidator(); mobileValidator(); passwordValidator();

    console.log(error1.textContent + error2.textContent + error3.textContent + error4.textContent + "\n")
    console.log(error1.textContent || error2.textContent || error3.textContent || error4.textContent)
    if(error1.textContent || error2.textContent || error3.textContent || error4.textContent){
        event.preventDefault();
    } 
})

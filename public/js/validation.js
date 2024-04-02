const name = document.getElementById("name")
const error1 = document.getElementById("error1")

const email = document.getElementById("email")
const error2 = document.getElementById("error2")

const mobile = document.getElementById("mobile")
const error3 = document.getElementById("error3")

name.addEventListener("blur",nameValidator);
email.addEventListener("blur",emailValidator);
mobile.addEventListener("blur",mobileValidator);
if(document.getElementById("password"))
{
    const password = document.getElementById("password")
    const error4 = document.getElementById("error4")
    password.addEventListener("blur",passwordValidator);
}


function ifExecuter(errorElement,errorHtml){
    errorElement.style.display = "block";
    errorElement.innerHTML = errorHtml;
    const star = errorElement.firstElementChild;
    star.style.color = "red";
}

function elseExecuter(errorElement, validatingElement){
    errorElement.style.display = "none";

    const span = document.createElement("span");
    span.innerHTML = "&nbsp &#10003;"
    span.style.cssText+=" color:green; font-size:18px; font-weight:bolder; ";
    let label = validatingElement.nextElementSibling ?? validatingElement.previousElementSibling;

    if(label.tagName.toLowerCase()!=="label"){
        const td = validatingElement.parentNode.parentNode.nextElementSibling;
        span.style.verticalAlign = "middle";
        td.appendChild(span);
        td.style.visibility = "visible";
    }
    else{
        label.after(span);
    }
    setTimeout(()=>{span.style.display = "none";}, 2200);
}



function nameValidator(){
    const name1 = name.value;
    const namePattern = /[a-zA-Z]/
    if(name1.trim()==""){
        ifExecuter(error1,"<span>*</span>Name should not be empty!")
        return;
    }
    if(!namePattern.test(name1)){
        ifExecuter(error1,"<span>*</span>Name should not contain number or special characters!");
        return;
    }
    if(name1.length<2){
        ifExecuter(error1,"<span>*</span>Name should have more than 2 characters!");
        return;
    }
    else{
        elseExecuter(error1,name);
    }
}

function emailValidator(){
    const email1 = email.value;
    const pattern = /^([a-zA-Z0-9._-]+)@([a-zA-Z.-]+).([a-zA-z]{2,4})$/ 
    if(email1.trim()==""){
        ifExecuter(error2,"<span>*</span>email-id should not be empty!");
        return;
    }
    if(!pattern.test(email1)){
        ifExecuter(error2,"<span>*</span>Enter a valid Id!");
    }
    else{
        elseExecuter(error2,email);
    }
}

function mobileValidator(){
    const mobile1 = mobile.value;
    const mobilePattern = /\d/
    if(mobile1.trim()==""){
        ifExecuter(error3,"<span>*</span>Mobile number cannot be empty!");
        return;
    }
    if(!mobilePattern.test(mobile1)){
        ifExecuter(error3,"<span>*</span>Enter a valid mobile number!");
        return;
    }
    if(mobile1.length<10 || mobile1.length>10){
        ifExecuter(error3,"<span>*</span>Mobile number should have 10 digits!")
        return;
    }
    else{
        elseExecuter(error3,mobile);
    }

}

function passwordValidator(){
    const password1 = password.value;
    const digitPattern = /\d/
    const alphaPattern = /[a-zA-Z]/
    const symbolPattern = /[!@#$%^&*()_~`+={}|:";<>?/*.,']|[\[\]\-\+]/  
    if(password1.trim()==""){
        ifExecuter(error4,"<span>*</span>Password cannot be empty!");
        return;
    }
    if(!digitPattern.test(password1) || !alphaPattern.test(password1) || !symbolPattern.test(password1)){
        ifExecuter(error4,"<span>*</span>Password should have atleast 1 number, 1 special character and alphabets!");
        return;
    }
    else if(password1.length<5){
        ifExecuter(error4,"<span>*</span>Password should have atleast 5 characters!");
        return;
    }
    else{
        elseExecuter(error4,password);
    }
}


const form = document.getElementById("form");

form.addEventListener("submit",function(event){
    
    if(!(document.getElementById("password")))
    { const error4={};
      error4.textContent="";}
    else{error4.textContent="";}

    error1.textContent = error2.textContent = error3.textContent = "";
    nameValidator(); emailValidator(); mobileValidator(); if(document.getElementById("password")){passwordValidator();}
   
    if(error1.textContent || error2.textContent || error3.textContent || error4.textContent){
        event.preventDefault();
    } 
})
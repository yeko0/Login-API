import './style.css'

const statusDot = document.getElementById("backend-status-dot");
const statusText = document.getElementById("backend-status-text");

const inputUserName = document.getElementById("login-userName");
const inputUserPin = document.getElementById("login-userPin");
const loginBtn = document.getElementById("login-btn");

const subHeaderTokenDot = document.getElementById("sub-header-token-dot");
const subHeaderTokenText = document.getElementById("sub-header-token-text");
const subHeaderTokenBtn = document.getElementById("sub-header-token-btn");
let currentToken = null;

setTimeout(() =>{
    checkBackendStatus();
    });

loginBtn.addEventListener("click", async function(){
    const loginRequest = {
        userName: inputUserName.value,
        userPin: inputUserPin.value
    }
    const response = await fetch("http://localhost:8081/auth/login",
                                                 {
                                                         method: "POST",
                                                         headers: { "Content-Type": "application/json" },
                                                         body: JSON.stringify(loginRequest),
                                                      },
                                              );
    const data = await response.json();
    currentToken = data.token;

    if(data.token != null){
        subHeaderTokenDot.className = "text-green-400";
        subHeaderTokenText.className = "text-green-400";
        subHeaderTokenText.textContent = "Valid";
    }else{
        subHeaderTokenDot.className = "text-red-400";
        subHeaderTokenText.className = "text-red-400";
        subHeaderTokenText.textContent = "no valid";
    }
    console.log(response);
    console.log(data);
})


subHeaderTokenBtn.addEventListener("click", async function(){

    if (currentToken === null) {
        console.log("No token to copy");
        return;
    }

    await navigator.clipboard.writeText(currentToken);
    console.log("Token copied");
})


//----------------- Functions ------------------

async function checkBackendStatus(){
    try {
        const response = await fetch("http://localhost:8081/users");

        if (response.ok) {
            statusDot.className = "text-green-400";
            statusText.textContent = "localhost:8081 online";
        } else {
            statusDot.className = "text-yellow-400";
            statusText.textContent = "localhost:8081 error";
        }
    }catch(error){
        statusDot.className = "text-red-400";
        statusText.textContent = "localhost:8081 offline";
    }
}

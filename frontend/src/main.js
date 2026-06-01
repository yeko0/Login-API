import './style.css'

const statusDot = document.getElementById("backend-status-dot");
const statusText = document.getElementById("backend-status-text");


setTimeout(() =>{
    checkBackendStatus();
    },
    3000);


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

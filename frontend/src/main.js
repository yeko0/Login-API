import './style.css'

const statusDot = document.getElementById("backend-status-dot");
const statusText = document.getElementById("backend-status-text");

const backendIsOnline = false;

setTimeout(() => {
    if(backendIsOnline){
        statusDot.className = "text-green-400";
        statusText.textContent = "localhost:8081 online";
    }else{
        statusDot.className = "text-red-400";
        statusText.textContent = "localhost:8081 offline";
    }
}, 3000);

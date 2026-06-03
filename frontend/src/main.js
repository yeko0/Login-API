import './style.css'

const statusStyles = {
    200: {
        text: "OK",
        classes: "text-green-400 border-emerald-400"
    },
    201: {
        text: "Created",
        classes: "text-green-400 border-emerald-400"
    },
    400: {
        text: "Bad Request",
        classes: "text-yellow-400 border-yellow-400"
    },
    401: {
        text: "Unauthorized",
        classes: "text-orange-400 border-orange-400"
    },
    403: {
        text: "Forbidden",
        classes: "text-red-400 border-red-400"
    },
    404: {
        text: "Not Found",
        classes: "text-slate-400 border-slate-400"
    },
    500: {
        text: "Server Error",
        classes: "text-red-400 border-red-400"
    }
};

const statusDot = document.getElementById("backend-status-dot");
const statusText = document.getElementById("backend-status-text");

const inputUserName = document.getElementById("login-userName");
const inputUserPin = document.getElementById("login-userPin");
const loginBtn = document.getElementById("login-btn");

const subHeaderTokenDot = document.getElementById("sub-header-token-dot");
const subHeaderTokenText = document.getElementById("sub-header-token-text");
const subHeaderTokenBtn = document.getElementById("sub-header-token-btn");

const apiResMethBadge = document.getElementById("api-response-method-badge");
const apiResUrl = document.getElementById("api-response-url");

const apiResInfoTagStatus = document.getElementById("api-response-info-tag-status");
const apiResInfoTagTime = document.getElementById("api-response-info-tag-time");
const apiResInfoTagAccessLvl = document.getElementById("api-response-info-tag-access-level");

const apiResBodyBtn = document.getElementById("api-response-body-btn");
const apiResHeadersBtn = document.getElementById("api-response-headers-btn");
const apiResPayloadBtn = document.getElementById("api-response-payload-btn");
const apiResCopyBtn = document.getElementById("api-response-copy-btn");
const apiResClearBtn = document.getElementById("api-response-clear-btn");

const apiResShowTextArea = document.getElementById("api-response-show-text-area");

let currentToken = null;
let selectedApiResBtn = apiResBodyBtn;
let lastApiResponse = null;
let lastRequest = null;

paintApiResBtn(selectedApiResBtn);

setTimeout(() =>{
    checkBackendStatus();
    }, 500);

loginBtn.addEventListener("click", async function(){
    const loginRequest = {
        userName: inputUserName.value,
        userPin: inputUserPin.value
    }
    const requestMethod = "POST";
    const requestHeaders = {"Content-Type": "application/json"}

    try{
        const startTime = performance.now();
        const response = await fetch("http://localhost:8081/auth/login",
                                                 {
                                                         method: requestMethod,
                                                         headers: requestHeaders,
                                                         body: JSON.stringify(loginRequest),
                                                      },
                                                 );
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        const data = await response.json();
        lastApiResponse ={
            data: data,
            response: response,
            headers: {
                requestHeaders: requestHeaders,
                responseHeaders: {"Content-Type": response.headers.get("content-type")}
            }
        };

        lastRequest = {
            userName: loginRequest.userName,
            userPin: "*********",
        }
        selectedApiResBtn = apiResBodyBtn;
        paintApiResBtn(selectedApiResBtn);
        renderResponsePanel(selectedApiResBtn, lastApiResponse, lastRequest);
        currentToken = data.token || null;

        if(data.token != null){
            subHeaderTokenDot.className = "text-green-400";
            subHeaderTokenText.className = "text-green-400";
            subHeaderTokenText.textContent = "Valid";
        }else{
            subHeaderTokenDot.className = "text-red-400";
            subHeaderTokenText.className = "text-red-400";
            subHeaderTokenText.textContent = "no valid";
        }

        apiResMethBadge.textContent = requestMethod;
        apiResMethBadge.className = "bg-cyan-950 text-xs text-cyan-400 border-2 border-cyan-400 rounded-full px-3 pt-1 pb-1.5";

        apiResUrl.textContent = response.url;
        apiResUrl.className = "text-cyan-400";

        const statusStyle = statusStyles[response.status];

        if (statusStyle) {
            apiResInfoTagStatus.textContent = response.status +" "+ statusStyle.text;
            apiResInfoTagStatus.className = statusStyle.classes;
        } else {
            apiResInfoTagStatus.textContent = "Unknown Status";
        }

        if(responseTime < 300){
            apiResInfoTagTime.textContent = `${responseTime} ms`;
            apiResInfoTagTime.className = "text-green-400";
        }else if(responseTime >= 300 && responseTime < 1000){
            apiResInfoTagTime.textContent = `${responseTime} ms`;
            apiResInfoTagTime.className = "text-yellow-400";
        }else{
            apiResInfoTagTime.textContent = `${responseTime} ms`;
            apiResInfoTagTime.className = "text-red-400";
        }

        if(data.userRole === "ADMIN"){
            apiResInfoTagAccessLvl.textContent = "Admin";
            apiResInfoTagAccessLvl.className = "text-amber-400";
        }else if(data.userRole === "USER"){
            apiResInfoTagAccessLvl.textContent = "User";
            apiResInfoTagAccessLvl.className = "text-sky-400";
        }else{
            apiResInfoTagAccessLvl.textContent = "Unknown";
            apiResInfoTagAccessLvl.className = "text-cyan-400";
        }

        console.log(response);
        console.log(data);

    } catch (error) {
        currentToken = null;

        apiResInfoTagStatus.textContent = "Connection failed";
        apiResInfoTagStatus.className = "text-red-400 border-red-400"

        apiResInfoTagTime.textContent = "None";
        apiResInfoTagTime.className = "text-red-400";

        apiResInfoTagAccessLvl.textContent = "None";
        apiResInfoTagAccessLvl.className = "text-red-400";

        subHeaderTokenDot.className = "text-red-400";
        subHeaderTokenText.className = "text-red-400";
        subHeaderTokenText.textContent = "no valid";

        console.log(error);
    }
});


subHeaderTokenBtn.addEventListener("click", async function(){

    if (!currentToken) {
        console.log("No token to copy");
        return;
    }

    await navigator.clipboard.writeText(currentToken);
    console.log("Token copied");
})


apiResBodyBtn.addEventListener("click", function(){
    selectedApiResBtn = apiResBodyBtn;
    paintApiResBtn(selectedApiResBtn);
    renderResponsePanel(selectedApiResBtn, lastApiResponse, lastRequest);
});


apiResHeadersBtn.addEventListener("click", function(){
    selectedApiResBtn = apiResHeadersBtn;
    paintApiResBtn(selectedApiResBtn);
    renderResponsePanel(selectedApiResBtn, lastApiResponse, lastRequest);
});


apiResPayloadBtn.addEventListener("click", function(){
    selectedApiResBtn = apiResPayloadBtn;
    paintApiResBtn(selectedApiResBtn);
    renderResponsePanel(selectedApiResBtn, lastApiResponse, lastRequest);
});

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


function renderResponsePanel(selectedApiResBtn, lastApiResponse, request){
    if(lastApiResponse == null) {
        apiResShowTextArea.textContent =
            "Example response:\n" +
            "[\n" +
            "  {\n" +
            "    \"userId\": 10,\n" +
            "    \"userName\": \"yeko33\",\n" +
            "    \"userRole\": \"USER\"\n" +
            "  },\n" +
            "  {\n" +
            "    \"userId\": 9,\n" +
            "    \"userName\": \"yeko45\",\n" +
            "    \"userRole\": \"USER\"\n" +
            "  }\n" +
            "]";
        return;
    }

    const statusStyle = statusStyles[lastApiResponse.response.status] || {
        classes: "text-slate-400 border-slate-400"
    };
    switch(selectedApiResBtn){
        case apiResBodyBtn:
            apiResShowTextArea.textContent = JSON.stringify(lastApiResponse.data, null, 2);
            apiResShowTextArea.className = statusStyle.classes + " text-base";
        break;

        case apiResHeadersBtn:
            apiResShowTextArea.textContent = JSON.stringify(lastApiResponse.headers, null, 2);
            apiResShowTextArea.className = statusStyle.classes + " text-base";
        break;

        case apiResPayloadBtn:
            apiResShowTextArea.textContent = JSON.stringify(request, null, 2);
            apiResShowTextArea.className = statusStyle.classes + " text-base";
        break;
    }
}


function paintApiResBtn(button){
    switch(button){
        case apiResBodyBtn:
            apiResHeadersBtn.className = "border-[#263449] text-slate-500";
            apiResPayloadBtn.className = "border-[#263449] text-slate-500";
        break;

        case apiResHeadersBtn:
            apiResBodyBtn.className = "border-[#263449] text-slate-500";
            apiResPayloadBtn.className = "border-[#263449] text-slate-500";
            break;

        case apiResPayloadBtn:
            apiResBodyBtn.className = "border-[#263449] text-slate-500";
            apiResHeadersBtn.className = "border-[#263449] text-slate-500";
            break;
    }
    button.className = "border-cyan-300 text-cyan-300";
}
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
    409: {
        text: "Invalid data",
        classes: "text-yellow-400 border-yellow-400"
    },
    500: {
        text: "Server Error",
        classes: "text-red-400 border-red-400"
    }
};

const statusDot = document.getElementById("backend-status-dot");
const statusText = document.getElementById("backend-status-text");

const loginUserName = document.getElementById("login-userName");
const loginUserPin = document.getElementById("login-userPin");
const loginBtn = document.getElementById("login-btn");

const registerUserName = document.getElementById("register-userName");
const registerUserPin = document.getElementById("register-userPin");
const registerBtn = document.getElementById("register-btn");

const changePinUserName = document.getElementById("change-pin-userName");
const changePinUserPin = document.getElementById("change-pin-userPin");
const changePinNewUserPin = document.getElementById("change-pin-newUserPin");
const changePinBtn = document.getElementById("change-pin-btn");

const showUsersAdminBtn = document.getElementById("show-users-admin-btn");

const searchUserByIdUserId = document.getElementById("search-user-by-id-userId");
const searchUserByIdBtn = document.getElementById("search-user-by-id-btn");

const changeUserRoleUserId = document.getElementById("change-user-role-userId");
const changeUserRoleUserRole = document.getElementById("change-user-role-userRole");
const changeUserRoleBtn = document.getElementById("change-user-role-btn");

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
let currentUserId = null;
let currentUserRole = null;
let currentSelectedApiResBtn = apiResBodyBtn;
let lastApiResponse = null;
let lastRequest = null;

paintApiResBtn(currentSelectedApiResBtn);

setTimeout(() =>{
    checkBackendStatus();
    }, 500);




loginBtn.addEventListener("click", async function(){
    apiResMethBadge.textContent = "POST";
    apiResMethBadge.className = "bg-cyan-950 text-xs text-cyan-400 border-2 border-cyan-400 rounded-full px-3 pt-1 pb-1.5";

    apiResUrl.textContent = "http://localhost:8081/auth/login";

    const loginRequest = {
        userName: loginUserName.value,
        userPin: loginUserPin.value
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
                responseHeaders: Object.fromEntries(response.headers.entries())
            }
        };

        lastRequest = {
            userName: loginRequest.userName,
            userPin: "*********",
        };

        if(response.ok){
            currentToken = data.token;
            currentUserId = data.userId;
            currentUserRole = data.userRole;
        }else{
            currentToken = null;
            currentUserId = null;
            currentUserRole = null;
        }

        currentSelectedApiResBtn = apiResBodyBtn;
        paintApiResBtn(currentSelectedApiResBtn);
        renderResponsePanel(currentSelectedApiResBtn, lastApiResponse, lastRequest);

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
            currentUserRole = "ADMIN";
        }else if(data.userRole === "USER"){
            apiResInfoTagAccessLvl.textContent = "User";
            apiResInfoTagAccessLvl.className = "text-sky-400";
            currentUserRole = "USER";
        }else{
            apiResInfoTagAccessLvl.textContent = "Unknown";
            apiResInfoTagAccessLvl.className = "text-cyan-400";
            currentUserRole = null;
        }

        console.log(response);
        console.log(data);

    } catch (error) {
        currentToken = null;
        currentUserId = null;
        currentUserRole = null;

        apiResInfoTagStatus.textContent = "Connection failed";
        apiResInfoTagStatus.className = "text-red-400 border-red-400"

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-red-400";

        apiResInfoTagAccessLvl.textContent = "--";
        apiResInfoTagAccessLvl.className = "text-red-400";

        subHeaderTokenDot.className = "text-red-400";
        subHeaderTokenText.className = "text-red-400";
        subHeaderTokenText.textContent = "no valid";

        console.log(error);
    }
});



registerBtn.addEventListener("click", async function(){
    apiResMethBadge.textContent = "POST";
    apiResMethBadge.className = "bg-cyan-950 text-xs text-cyan-400 border-2 border-cyan-400 rounded-full px-3 pt-1 pb-1.5";

    apiResUrl.textContent = "http://localhost:8081/users";

    const registerRequest = {
        userName: registerUserName.value,
        userPin: registerUserPin.value
    }
    const requestMethod = "POST";
    const requestHeaders = {"Content-Type": "application/json"};

    apiResInfoTagAccessLvl.textContent = "Login to get";
    apiResInfoTagAccessLvl.className = "text-cyan-400";
    subHeaderTokenDot.className = "text-cyan-400";
    subHeaderTokenText.className = "text-cyan-400";
    subHeaderTokenText.textContent = "Login to get valid";

    try{
        const startTime = performance.now();
        const response = await fetch("http://localhost:8081/users",
            {
                method: requestMethod,
                headers: requestHeaders,
                body: JSON.stringify(registerRequest),
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
                responseHeaders: Object.fromEntries(response.headers.entries())
            }
        };

        lastRequest = {
            userName: registerRequest.userName,
            userPin: "*********",
        };

        currentSelectedApiResBtn = apiResBodyBtn;
        paintApiResBtn(currentSelectedApiResBtn);
        renderResponsePanel(currentSelectedApiResBtn, lastApiResponse, lastRequest);

        apiResMethBadge.textContent = requestMethod;
        apiResMethBadge.className = "bg-cyan-950 text-xs text-cyan-400 border-2 border-cyan-400 rounded-full px-3 pt-1 pb-1.5";

        apiResUrl.textContent = response.url;

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

        console.log(response);
        console.log(data);

    } catch (error) {

        apiResInfoTagStatus.textContent = "Connection failed";
        apiResInfoTagStatus.className = "text-red-400 border-red-400"

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-red-400";

        apiResInfoTagAccessLvl.textContent = "--";
        apiResInfoTagAccessLvl.className = "text-red-400";

        console.log(error);
    }
});



changePinBtn.addEventListener("click", async function(){
    apiResMethBadge.textContent = "PATCH";
    apiResMethBadge.className = "bg-yellow-950 text-xs text-yellow-400 border-2 border-yellow-400 rounded-full px-3 pt-1 pb-1.5";

    apiResUrl.textContent = "http://localhost:8081/users/"+currentUserId+"/pin";

    const changePinRequest = {
        userName: changePinUserName.value,
        userPin: changePinUserPin.value,
        newUserPin: changePinNewUserPin.value
    };

    if(currentToken === null || currentUserId === null){
        subHeaderTokenDot.className = "text-orange-400";
        subHeaderTokenText.className = "text-orange-400";
        subHeaderTokenText.textContent = "Login to get valid";

        apiResInfoTagStatus.textContent = "401 Unauthorized";
        apiResInfoTagStatus.className = "text-orange-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-cyan-400";

        apiResInfoTagAccessLvl.textContent = "Login to get";
        apiResInfoTagAccessLvl.className = "text-orange-400";

        lastApiResponse = {
            data: {
                message: [
                    "Successful login is required",
                    "before changing pin",
                    "Please login and try again"
                ]
            },
            response: {
                status: 401
            },
            headers: {
                requestHeaders: {},
                responseHeaders: {}
            }
        };

        lastRequest = {
            userName: changePinRequest.userName,
            userPin: "*********",
            newUserPin: "*********"
        };

        currentSelectedApiResBtn = apiResBodyBtn;
        paintApiResBtn(currentSelectedApiResBtn);
        renderResponsePanel(currentSelectedApiResBtn, lastApiResponse, lastRequest);
        return;
    }

    const requestMethod = "PATCH";
    const requestHeaders ={
         "Authorization": "Bearer " + currentToken,
         "Content-Type": "application/json"
    };

    try{
        const startTime = performance.now()
        const response = await fetch("http://localhost:8081/users/"+currentUserId+"/pin",
            {
                method: requestMethod,
                headers: requestHeaders,
                body: JSON.stringify(changePinRequest),
            });
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        const data = await response.json();

        lastApiResponse ={
            data: data,
            response: response,
            headers: {
                requestHeaders: requestHeaders,
                responseHeaders: Object.fromEntries(response.headers.entries())
            }
        };

        lastRequest = {
            userName: changePinRequest.userName,
            userPin: "*********",
            newUserPin: "*********"
        };

        if (response.ok) {
            currentToken = null;
            currentUserId = null;
            currentUserRole = null;

            subHeaderTokenDot.className = "text-red-400";
            subHeaderTokenText.textContent = "Login again for valid";
            subHeaderTokenText.className = "text-red-400";
            apiResInfoTagAccessLvl.textContent = "Login again";
            apiResInfoTagAccessLvl.className = "text-red-400";
            lastApiResponse.data = [
                lastApiResponse.data,
                { message: [
                        "After changing pin login is required",
                        "login again for new (token & Access Level)",
                        "login again with new password/pin"
                    ]
                }
            ];
        }

        currentSelectedApiResBtn = apiResBodyBtn;
        paintApiResBtn(currentSelectedApiResBtn);
        renderResponsePanel(currentSelectedApiResBtn, lastApiResponse, lastRequest);

        apiResMethBadge.textContent = requestMethod;
        apiResMethBadge.className = "bg-yellow-950 text-xs text-yellow-400 border-2 border-yellow-400 rounded-full px-3 py-0.5";

        apiResUrl.textContent = response.url;

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

        console.log(response);
        console.log(data);

    }catch(error) {
        currentToken = null;
        currentUserId = null;
        currentUserRole = null;

        apiResInfoTagStatus.textContent = "Connection failed";
        apiResInfoTagStatus.className = "text-red-400 border-red-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-red-400";

        apiResInfoTagAccessLvl.textContent = "--";
        apiResInfoTagAccessLvl.className = "text-red-400";

        subHeaderTokenDot.className = "text-red-400";
        subHeaderTokenText.className = "text-red-400";
        subHeaderTokenText.textContent = "no valid";

        console.log(error);
    }

});



showUsersAdminBtn.addEventListener("click", async function(){
    apiResMethBadge.textContent = "GET";
    apiResMethBadge.className = "bg-emerald-950 text-xs text-emerald-400 border-2 border-emerald-400 rounded-full px-3 pt-1 pb-1.5";

    apiResUrl.textContent = "http://localhost:8081/admin/users";

    if(currentToken === null){
        subHeaderTokenDot.className = "text-orange-400";
        subHeaderTokenText.className = "text-orange-400";
        subHeaderTokenText.textContent = "Login to get valid";

        apiResInfoTagStatus.textContent = "401 Unauthorized";
        apiResInfoTagStatus.className = "text-orange-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-cyan-400";

        apiResInfoTagAccessLvl.textContent = "Login to get";
        apiResInfoTagAccessLvl.className = "text-orange-400";

        lastApiResponse = {
            data: {
                message: [
                    "Successful Admin-login is required",
                    "before checking users in data base",
                    "Please login as ADMIN and try again"
                ]
            },
            response: {
                status: 401
            },
            headers: {
                requestHeaders: "Empty",
                responseHeaders: "Empty"
            }
        };

        lastRequest = "Empty";

        currentSelectedApiResBtn = apiResBodyBtn;
        paintApiResBtn(currentSelectedApiResBtn);
        renderResponsePanel(currentSelectedApiResBtn, lastApiResponse, lastRequest);
        return;
    }

    if(currentUserRole !== "ADMIN"){
        apiResInfoTagStatus.textContent = "403 Forbidden";
        apiResInfoTagStatus.className = "text-red-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-cyan-400";
        lastApiResponse = {
            data: {
                message: [
                    "Admin Access level is required",
                    "before checking users in data base",
                    "Please login as ADMIN and try again"
                ]
            },
            response: {
                status: 403
            },
            headers: {
                requestHeaders: "Empty",
                responseHeaders: "Empty"
            }
        };

        lastRequest = "Empty";

        currentSelectedApiResBtn = apiResBodyBtn;
        paintApiResBtn(currentSelectedApiResBtn);
        renderResponsePanel(currentSelectedApiResBtn, lastApiResponse, lastRequest);
        return;
    }

    const requestMethod = "GET";
    const requestHeaders ={"Authorization": "Bearer "+ currentToken};

    try{
        const startTime = performance.now();
        const response = await fetch("http://localhost:8081/admin/users",
                                                    {
                                                         method: requestMethod,
                                                         headers: requestHeaders
                                                     }
                                                );
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        const data = await response.json();

        lastApiResponse ={
           data: data,
           response: response,
           headers: {
                requestHeaders: requestHeaders,
                responseHeaders: Object.fromEntries(response.headers.entries())
           }
        };

        lastRequest = "Empty";

        currentSelectedApiResBtn = apiResBodyBtn;
        paintApiResBtn(currentSelectedApiResBtn);
        renderResponsePanel(currentSelectedApiResBtn, lastApiResponse, lastRequest);

        apiResMethBadge.textContent = requestMethod;
        apiResMethBadge.className = "bg-emerald-950 text-xs text-emerald-400 border-2 border-emerald-400 rounded-full px-3 py-0.5";

        apiResUrl.textContent = response.url;

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

    }catch(error){
        currentToken = null;
        currentUserId = null;
        currentUserRole = null;

        apiResInfoTagStatus.textContent = "Connection failed";
        apiResInfoTagStatus.className = "text-red-400 border-red-400"

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-red-400";

        apiResInfoTagAccessLvl.textContent = "--";
        apiResInfoTagAccessLvl.className = "text-red-400";

        subHeaderTokenDot.className = "text-red-400";
        subHeaderTokenText.className = "text-red-400";
        subHeaderTokenText.textContent = "no valid";

        console.log(error);
    }

});



searchUserByIdBtn.addEventListener("click", async function(){
    apiResMethBadge.textContent = "GET";
    apiResMethBadge.className = "bg-emerald-950 text-xs text-emerald-400 border-2 border-emerald-400 rounded-full px-3 pt-1 pb-1.5";

    apiResUrl.textContent = "http://localhost:8081/users/"+ searchUserByIdUserId.value;

    if(currentToken === null){
        subHeaderTokenDot.className = "text-orange-400";
        subHeaderTokenText.className = "text-orange-400";
        subHeaderTokenText.textContent = "Login to get valid";

        apiResInfoTagStatus.textContent = "401 Unauthorized";
        apiResInfoTagStatus.className = "text-orange-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-cyan-400";

        apiResInfoTagAccessLvl.textContent = "Login to get";
        apiResInfoTagAccessLvl.className = "text-orange-400";

        lastApiResponse = {
            data: {
                message: [
                    "Successful Admin-login is required",
                    "before searching a user in data base",
                    "Please login as ADMIN and try again"
                ]
            },
            response: {
                status: 401
            },
            headers: {
                requestHeaders: "Empty",
                responseHeaders: "Empty"
            }
        };

        lastRequest = "Empty";

        currentSelectedApiResBtn = apiResBodyBtn;
        paintApiResBtn(currentSelectedApiResBtn);
        renderResponsePanel(currentSelectedApiResBtn, lastApiResponse, lastRequest);
        return;
    }

    if(currentUserRole !== "ADMIN"){
        apiResInfoTagStatus.textContent = "403 Forbidden";
        apiResInfoTagStatus.className = "text-red-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-cyan-400";
        lastApiResponse = {
            data: {
                message: [
                    "Admin Access level is required",
                    "before searching a user in data base",
                    "Please login as ADMIN and try again"
                ]
            },
            response: {
                status: 403
            },
            headers: {
                requestHeaders: "Empty",
                responseHeaders: "Empty"
            }
        };

        lastRequest = "Empty";

        currentSelectedApiResBtn = apiResBodyBtn;
        paintApiResBtn(currentSelectedApiResBtn);
        renderResponsePanel(currentSelectedApiResBtn, lastApiResponse, lastRequest);
        return;
    }

    if(searchUserByIdUserId.value === "" || searchUserByIdUserId.value === null){
        apiResInfoTagStatus.textContent = "400 Bad Request";
        apiResInfoTagStatus.className = "text-yellow-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-yellow-400";
        lastApiResponse = {
            data: {
                message: [
                    "User ID to search is required",
                    "Input area cant be empty",
                    "Please enter a user ID in the input area"
                ]
            },
            response: {
                status: 400
            },
            headers: {
                requestHeaders: "Empty",
                responseHeaders: "Empty"
            }
        };

        lastRequest = "Empty";

        currentSelectedApiResBtn = apiResBodyBtn;
        paintApiResBtn(currentSelectedApiResBtn);
        renderResponsePanel(currentSelectedApiResBtn, lastApiResponse, lastRequest);
        return;
    }

    const requestMethod = "GET";
    const requestHeaders ={"Authorization": "Bearer "+ currentToken};
    try{
        const startTime = performance.now();
        const response = await fetch("http://localhost:8081/users/"+ searchUserByIdUserId.value,
            {
                method: requestMethod,
                headers: requestHeaders
            }
        );
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        const data = await response.json();

        lastApiResponse ={
            data: data,
            response: response,
            headers: {
                requestHeaders: requestHeaders,
                responseHeaders: Object.fromEntries(response.headers.entries())
            }
        };

        lastRequest = "Empty";

        currentSelectedApiResBtn = apiResBodyBtn;
        paintApiResBtn(currentSelectedApiResBtn);
        renderResponsePanel(currentSelectedApiResBtn, lastApiResponse, lastRequest);

        apiResMethBadge.textContent = requestMethod;
        apiResMethBadge.className = "bg-emerald-950 text-xs text-emerald-400 border-2 border-emerald-400 rounded-full px-3 py-0.5";

        apiResUrl.textContent = response.url;

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

    }catch(error){

        apiResInfoTagStatus.textContent = "Connection failed";
        apiResInfoTagStatus.className = "text-red-400 border-red-400"

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-red-400";

        apiResInfoTagAccessLvl.textContent = "--";
        apiResInfoTagAccessLvl.className = "text-red-400";

        subHeaderTokenDot.className = "text-red-400";
        subHeaderTokenText.className = "text-red-400";
        subHeaderTokenText.textContent = "no valid";

        console.log(error);
    }
});



changeUserRoleBtn.addEventListener("click", async function() {
    apiResMethBadge.textContent = "PATCH";
    apiResMethBadge.className = "bg-yellow-950 text-xs text-yellow-400 border-2 border-yellow-400 rounded-full px-3 pt-1 pb-1.5";

    apiResUrl.textContent = "http://localhost:8081/users/"+ changeUserRoleUserId.value +"/role";

    if (currentToken === null) {
        subHeaderTokenDot.className = "text-orange-400";
        subHeaderTokenText.className = "text-orange-400";
        subHeaderTokenText.textContent = "Login to get valid";

        apiResInfoTagStatus.textContent = "401 Unauthorized";
        apiResInfoTagStatus.className = "text-orange-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-cyan-400";

        apiResInfoTagAccessLvl.textContent = "Login to get";
        apiResInfoTagAccessLvl.className = "text-orange-400";

        lastApiResponse = {
            data: {
                message: [
                    "Successful Admin-login is required",
                    "before searching a user in data base",
                    "Please login as ADMIN and try again"
                ]
            },
            response: {
                status: 401
            },
            headers: {
                requestHeaders: "Empty",
                responseHeaders: "Empty"
            }
        };

        lastRequest = "Empty";

        currentSelectedApiResBtn = apiResBodyBtn;
        paintApiResBtn(currentSelectedApiResBtn);
        renderResponsePanel(currentSelectedApiResBtn, lastApiResponse, lastRequest);
        return;
    }

    if (currentUserRole !== "ADMIN") {
        apiResInfoTagStatus.textContent = "403 Forbidden";
        apiResInfoTagStatus.className = "text-red-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-cyan-400";
        lastApiResponse = {
            data: {
                message: [
                    "Admin Access level is required",
                    "before searching a user in data base",
                    "Please login as ADMIN and try again"
                ]
            },
            response: {
                status: 403
            },
            headers: {
                requestHeaders: "Empty",
                responseHeaders: "Empty"
            }
        };

        lastRequest = "Empty";

        currentSelectedApiResBtn = apiResBodyBtn;
        paintApiResBtn(currentSelectedApiResBtn);
        renderResponsePanel(currentSelectedApiResBtn, lastApiResponse, lastRequest);
        return;
    }

    if (changeUserRoleUserRole.value === "" || changeUserRoleUserRole.value === null ||
               changeUserRoleUserId.value === "" || changeUserRoleUserId.value === null) {
        apiResInfoTagStatus.textContent = "400 Bad Request";
        apiResInfoTagStatus.className = "text-yellow-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-yellow-400";
        lastApiResponse = {
            data: {
                message: [
                    "User ID and User role are required",
                    "Input areas cant be empty",
                    "Please enter a user ID in the input area",
                    "and Select a user role in the dropdown menu"
                ]
            },
            response: {
                status: 400
            },
            headers: {
                requestHeaders: "Empty",
                responseHeaders: "Empty"
            }
        };

        lastRequest = "Empty";

        currentSelectedApiResBtn = apiResBodyBtn;
        paintApiResBtn(currentSelectedApiResBtn);
        renderResponsePanel(currentSelectedApiResBtn, lastApiResponse, lastRequest);
        return;
    }

    const requestMethod = "PATCH";
    const requestHeaders ={
        "Authorization": "Bearer " + currentToken,
        "Content-Type": "application/json"
    };
    const changeRoleRequest ={ "userRole": changeUserRoleUserRole.value };
    try {
        const startTime = performance.now();
        const response = await fetch("http://localhost:8081/admin/users/"+ changeUserRoleUserId.value +"/role",
            {
                method: requestMethod,
                headers: requestHeaders,
                body: JSON.stringify(changeRoleRequest)
            }
        );
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        const data = await response.json();

        lastApiResponse ={
            data: data,
            response: response,
            headers: {
                requestHeaders: requestHeaders,
                responseHeaders: Object.fromEntries(response.headers.entries())
            }
        };

        lastRequest = changeRoleRequest;

        currentSelectedApiResBtn = apiResBodyBtn;
        paintApiResBtn(currentSelectedApiResBtn);
        renderResponsePanel(currentSelectedApiResBtn, lastApiResponse, lastRequest);

        apiResMethBadge.textContent = requestMethod;
        apiResMethBadge.className = "bg-yellow-950 text-xs text-yellow-400 border-2 border-yellow-400 rounded-full px-3 py-0.5";

        apiResUrl.textContent = response.url;

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

    }catch(error){

        apiResInfoTagStatus.textContent = "Connection failed";
        apiResInfoTagStatus.className = "text-red-400 border-red-400"

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-red-400";

        apiResInfoTagAccessLvl.textContent = "--";
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
});


apiResBodyBtn.addEventListener("click", function(){
    currentSelectedApiResBtn = apiResBodyBtn;
    paintApiResBtn(currentSelectedApiResBtn);
    renderResponsePanel(currentSelectedApiResBtn, lastApiResponse, lastRequest);
});


apiResHeadersBtn.addEventListener("click", function(){
    currentSelectedApiResBtn = apiResHeadersBtn;
    paintApiResBtn(currentSelectedApiResBtn);
    renderResponsePanel(currentSelectedApiResBtn, lastApiResponse, lastRequest);
});


apiResPayloadBtn.addEventListener("click", function(){
    currentSelectedApiResBtn = apiResPayloadBtn;
    paintApiResBtn(currentSelectedApiResBtn);
    renderResponsePanel(currentSelectedApiResBtn, lastApiResponse, lastRequest);
});


apiResCopyBtn.addEventListener("click", async function(){
    await navigator.clipboard.writeText(apiResShowTextArea.textContent);
});


apiResClearBtn.addEventListener("click", function(){
    apiResShowTextArea.textContent = "";
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
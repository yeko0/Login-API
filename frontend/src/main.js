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

const backendStatusDot = document.getElementById("backend-status-dot");
const backendStatusText = document.getElementById("backend-status-text");

const loginUserName = document.getElementById("login-userName");
const loginUserPin = document.getElementById("login-userPin");
const loginBtn = document.getElementById("login-btn");

const registerUserUserName = document.getElementById("register-user-userName");
const registerUserUserPin = document.getElementById("register-user-userPin");
const registerUserBtn = document.getElementById("register-user-btn");

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

const deleteUserByIdUserId = document.getElementById("delete-user-by-id-userId");
const deleteUserByIdUserName = document.getElementById("delete-user-by-id-userName");
const deleteUserByIdUserPin = document.getElementById("delete-user-by-id-userPin");
const deleteUserByIdBtn = document.getElementById("delete-user-btn");

const currentSessionBtn = document.getElementById("current-session-btn");

const showAllUsersPublicBtn = document.getElementById("show-all-users-public-btn");

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

const apiResPanelScreen = document.getElementById("api-response-show-text-area");

const apiBaseURL = "http://localhost:8081";

const endPointsURL = {
    login: `${apiBaseURL}/auth/login`,
    registerUser: `${apiBaseURL}/users`,
    showAllUsersAdmin: `${apiBaseURL}/admin/users`,
    currentSession: `${apiBaseURL}/auth/session`,
    showAllUsersPublic: `${apiBaseURL}/users`,

    changePin: (userId) => `${apiBaseURL}/users/${userId}/pin`,
    searchUserById: (userId) => `${apiBaseURL}/users/${userId}`,
    changeUserRole: (userId) => `${apiBaseURL}/admin/users/${userId}/role`,
    deleteUser: (userId) => `${apiBaseURL}/users/${userId}`
};

const badgeClassesStyles = {
    public : "bg-teal-950 text-xs text-teal-400 border-2 border-teal-400 rounded-full px-3 py-0.5 pt-1 pb-1.5",
    owner : "bg-sky-950 text-xs text-sky-400 border-2 border-sky-400 rounded-full px-3 py-0.5 pt-1 pb-1.5",
    admin : "bg-orange-950 text-xs text-orange-400 border-2 border-orange-400 rounded-full px-3 py-0.5 pt-1 pb-1.5",
    token : "bg-violet-950 text-xs text-violet-400 border-2 border-violet-400 rounded-full px-3 py-0.5 pt-1 pb-1.5",
    GET : "bg-emerald-950 text-xs text-emerald-400 border-2 border-emerald-400 rounded-full px-3 py-0.5 pt-1 pb-1.5",
    POST : "bg-cyan-950 text-xs text-cyan-400 border-2 border-cyan-400 rounded-full px-3 py-0.5 pt-1 pb-1.5",
    PATCH : "bg-yellow-950 text-xs text-yellow-400 border-2 border-yellow-400 rounded-full px-3 py-0.5 pt-1 pb-1.5",
    DELETE : "bg-red-950 text-xs text-red-500 border-2 border-red-500 rounded-full px-3 py-0.5 pt-1 pb-1.5"
};

let currentToken = null;
let currentUserId = null;
let currentUserRole = null;

let apiResPanelState = {
    request: {
        method: "GET",
        url: apiBaseURL,
        headers: "Empty",
        body: "Empty",
        bodyResponse: "Empty"
    },

    response: {
        raw: null,
        status: 401,
        headers: "Empty",
        body: {
            backendMessage: "Empty"
        }
    },

    fetchSpeed: {
        startTime: 0,
        endTime: 0,
        get responseTime() {
            return Math.round(this.endTime - this.startTime);
        }
    },

    selectedButton: apiResBodyBtn
};


setTimeout(() => {
    checkBackendStatus();
}, 500);

updatePillApiResBtns();

loginBtn.addEventListener("click", async function () {
    apiResPanelState.request.url = endPointsURL.login;
    apiResPanelState.request.method = "POST";
    apiResPanelState.request.headers = {"Content-Type": "application/json"};
    apiResPanelState.request.body = {
        userName: loginUserName.value,
        userPin: loginUserPin.value
    };
    apiResPanelState.request.bodyResponse = {
        userName: apiResPanelState.request.body.userName,
        userPin: "*********"
    };

    try {
        apiResPanelState.fetchSpeed.startTime = performance.now();
        apiResPanelState.response.raw = await fetch(apiResPanelState.request.url,
            {
                method: apiResPanelState.request.method,
                headers: apiResPanelState.request.headers,
                body: JSON.stringify(apiResPanelState.request.body)
            },
        );
        apiResPanelState.fetchSpeed.endTime = performance.now();
        apiResPanelState.response.body = await apiResPanelState.response.raw.json();

        updateApiResPanelState();

        if (apiResPanelState.response.raw.ok) {
            setSession(apiResPanelState.response.body);
        }

        renderApiResponse();

    } catch (error) {

        updateConnectionErrorInfoTags();

        console.log(error);
    }
});



registerUserBtn.addEventListener("click", async function () {
    apiResPanelState.request.url = endPointsURL.registerUser;
    apiResPanelState.request.method = "POST";
    apiResPanelState.request.headers = {"Content-Type": "application/json"};
    apiResPanelState.request.body = {
        userName: registerUserUserName.value,
        userPin: registerUserUserPin.value
    };
    apiResPanelState.request.bodyResponse = {
        userName: apiResPanelState.request.body.userName,
        userPin: "*********"
    };

    try {
        apiResPanelState.fetchSpeed.startTime = performance.now();
        apiResPanelState.response.raw = await fetch(apiResPanelState.request.url,
            {
                method: apiResPanelState.request.method,
                headers: apiResPanelState.request.headers,
                body: JSON.stringify(apiResPanelState.request.body)
            },
        );
        apiResPanelState.fetchSpeed.endTime = performance.now();
        apiResPanelState.response.body = await apiResPanelState.response.raw.json();

        updateApiResPanelState();

        if (apiResPanelState.response.raw.ok) {
            addFrontendMessages(
                "User registered successfully",
                "Login with new user if you wish"
            );
        }

        renderApiResponse();

    } catch (error) {

        updateConnectionErrorInfoTags();

        console.log(error);
    }
});



changePinBtn.addEventListener("click", async function () {
    apiResPanelState.request.url = endPointsURL.changePin(currentUserId);
    apiResPanelState.request.method = "PATCH";
    apiResPanelState.request.headers = {
        "Authorization": "Bearer " + currentToken,
        "Content-Type": "application/json"
    };
    apiResPanelState.request.body = {
        userName: changePinUserName.value,
        userPin: changePinUserPin.value,
        newUserPin: changePinNewUserPin.value
    };
    apiResPanelState.request.bodyResponse = {
        userName: apiResPanelState.request.body.userName,
        userPin: "*********",
        newUserPin: "*********"
    };

    if(currentToken === null || currentUserId === null){
        addFrontendMessages(
            "Successful login is required",
            "before changing PIN",
            "please login with valid credentials"
        );
        renderApiResponse();
        return;
    }

    try {
        apiResPanelState.fetchSpeed.startTime = performance.now();
        apiResPanelState.response.raw = await fetch(apiResPanelState.request.url,
            {
                method: apiResPanelState.request.method,
                headers: apiResPanelState.request.headers,
                body: JSON.stringify(apiResPanelState.request.body)
            },
        );
        apiResPanelState.fetchSpeed.endTime = performance.now();
        apiResPanelState.response.body = await apiResPanelState.response.raw.json();

        updateApiResPanelState();

        if (apiResPanelState.response.raw.ok) {
            resetSession();
            addFrontendMessages(
                "Login is required",
                "please login again with new PIN"
            );
        }

        renderApiResponse();

    } catch (error) {

        updateConnectionErrorInfoTags();
        console.log(error);
    }
});



showUsersAdminBtn.addEventListener("click", async function () {
    const requestMethod = "GET";
    const requestHeaders = {"Authorization": "Bearer " + currentToken};

    updateApiResponseSubHeader(requestMethod, badgeClassesStyles.GET, endPointsURL.showAllUsersAdmin);

    if (blockIfNotLoggedIn("ADMIN")) {
        return;
    }

    if (blockIfNotAdmin()) {
        return;
    }

    try {
        const startTime = performance.now();
        const response = await fetch(endPointsURL.showAllUsersAdmin,
            {
                method: requestMethod,
                headers: requestHeaders
            }
        );
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        const data = await response.json();

        updateApiResPanelState(data,
            {
                status: response.status,
                headers: {
                    requestHeaders: requestHeaders,
                    responseHeaders: Object.fromEntries(response.headers.entries())
                }
            }
        );

        updatePillApiResBtns(apiResBodyBtn);
        updateInfoTagStatus(response);
        updateResponseTime(responseTime);

    } catch (error) {

        updateConnectionErrorInfoTags();

        console.log(error);
    }
});



searchUserByIdBtn.addEventListener("click", async function () {
    const requestMethod = "GET";
    const requestHeaders = {"Authorization": "Bearer " + currentToken};
    const searchUserByIdURLrequest = endPointsURL.searchUserById(searchUserByIdUserId.value)

    updateApiResponseSubHeader(requestMethod, badgeClassesStyles.GET, searchUserByIdURLrequest);

    if (blockIfNotLoggedIn("ADMIN")) {
        return;
    }

    if (blockIfNotAdmin()) {
        return;
    }

    if (searchUserByIdUserId.value === "" || searchUserByIdUserId.value === null) {

        apiResInfoTagStatus.textContent = "400 Bad Request";
        apiResInfoTagStatus.className = "text-yellow-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-yellow-400";

        updateApiResPanelState(
            {
                backendMessage: [
                    "User ID to search is required",
                    "Input area can't be empty",
                    "Please enter a user ID in the input area"
                ]
            },
            {
                status: 400
            }
        );

        updatePillApiResBtns(apiResBodyBtn);
        return;
    }

    try {

        const startTime = performance.now();
        const response = await fetch(searchUserByIdURLrequest,
            {
                method: requestMethod,
                headers: requestHeaders
            }
        );
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        const data = await response.json();

        updateApiResPanelState(data,
            {
                status: response.status,
                headers: {
                    requestHeaders: requestHeaders,
                    responseHeaders: Object.fromEntries(response.headers.entries())
                }
            }
        );

        updatePillApiResBtns(apiResBodyBtn);
        updateInfoTagStatus(response);
        updateResponseTime(responseTime);

    } catch (error) {

        updateConnectionErrorInfoTags();

        console.log(error);
    }
});



changeUserRoleBtn.addEventListener("click", async function () {
    const requestMethod = "PATCH";
    const requestHeaders = {
        "Authorization": "Bearer " + currentToken,
        "Content-Type": "application/json"
    };
    const requestBody = {"userRole": changeUserRoleUserRole.value};
    const changeUserRoleURLrequest = endPointsURL.changeUserRole(changeUserRoleUserId.value);

    updateApiResponseSubHeader(requestMethod, badgeClassesStyles.PATCH, changeUserRoleURLrequest);

    if (blockIfNotLoggedIn("ADMIN")) {
        return;
    }

    if (blockIfNotAdmin()) {
        return;
    }

    if( changeUserRoleUserRole.value === "" || changeUserRoleUserRole.value === null ||
        changeUserRoleUserId.value === "" || changeUserRoleUserId.value === null ){
        apiResInfoTagStatus.textContent = "400 Bad Request";
        apiResInfoTagStatus.className = "text-yellow-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-yellow-400";

        updateApiResPanelState(
            {
                backendMessage: [
                    "User ID and User role are required",
                    "Input areas can't be empty",
                    "Please enter a user ID in the input area",
                    "and select a user role in the dropdown menu"
                ]
            },
            {
                status: 400,
            }
        );

        updatePillApiResBtns(apiResBodyBtn);
        return;
    }

    try {
        const startTime = performance.now();
        const response = await fetch(changeUserRoleURLrequest,
            {
                method: requestMethod,
                headers: requestHeaders,
                body: JSON.stringify(requestBody)
            }
        );
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        const data = await response.json();

        updateApiResPanelState(data,
            {
                status: response.status,
                headers: {
                    requestHeaders: requestHeaders,
                    responseHeaders: Object.fromEntries(response.headers.entries())
                },
                request: requestBody
            }
        );

        updatePillApiResBtns(apiResBodyBtn);
        updateInfoTagStatus(response);
        updateResponseTime(responseTime);

    } catch (error) {

        updateConnectionErrorInfoTags();

        console.log(error);
    }

});



deleteUserByIdBtn.addEventListener("click", async function () {
    const requestMethod = "DELETE";
    const requestHeaders = {
        "Authorization": "Bearer " + currentToken,
        "Content-Type": "application/json"
    };
    const requestBody = {
        "userName": deleteUserByIdUserName.value,
        "userPin": deleteUserByIdUserPin.value
    };
    const requestBodyResponse = {
        userId: deleteUserByIdUserId.value,
        userName: requestBody.userName,
        userPin: "*********"
    };
    const deleteUserByIdURLrequest = endPointsURL.deleteUser(deleteUserByIdUserId.value);

    updateApiResponseSubHeader(requestMethod, badgeClassesStyles.DELETE, deleteUserByIdURLrequest);

    if (blockIfNotLoggedIn()) {
        return;
    }

    if( deleteUserByIdUserId.value === "" || deleteUserByIdUserId.value === null ||
        deleteUserByIdUserName.value === "" || deleteUserByIdUserName.value === null ||
        deleteUserByIdUserPin.value === "" || deleteUserByIdUserPin.value === null ){

        apiResInfoTagStatus.textContent = "400 Bad Request";
        apiResInfoTagStatus.className = "text-yellow-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-yellow-400";

        updateApiResPanelState(
            {
                backendMessage: [
                    "Confirmation of ID, name and PIN are required",
                    "Input areas can't be empty",
                    "Please fill all fields and try again"
                ]
            },
            {
                status: 400
            }
        );

        updatePillApiResBtns(apiResBodyBtn);
        return;
    }

    const confirmDelete = confirm("Delete your account permanently?");
    if (!confirmDelete) {
        return;
    }

    try {
        const startTime = performance.now();
        const response = await fetch(deleteUserByIdURLrequest,
            {
                method: requestMethod,
                headers: requestHeaders,
                body: JSON.stringify(requestBody)
            }
        );

        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        const data = await response.json();

        if (response.ok) {
            addFrontendMessages(data, [
                "Session has been cleared",
                "Please login again"
            ]);

            resetSession();
        }

        updateApiResPanelState(data,
            {
                status: response.status,
                headers: {
                    requestHeaders: requestHeaders,
                    responseHeaders: Object.fromEntries(response.headers.entries())
                },
                request: requestBodyResponse
            }
        );

        updatePillApiResBtns(apiResBodyBtn);
        updateInfoTagStatus(response);
        updateResponseTime(responseTime);


    } catch (error) {

        updateConnectionErrorInfoTags();

        console.log(error);
    }

});



currentSessionBtn.addEventListener("click", async function () {
    const requestMethod = "GET";
    const requestHeaders = {"Authorization": "Bearer " + currentToken};

    updateApiResponseSubHeader(requestMethod, badgeClassesStyles.GET, endPointsURL.currentSession);

    if (blockIfNotLoggedIn()) {
        return;
    }

    try {
        const startTime = performance.now();
        const response = await fetch(endPointsURL.currentSession,
            {
                method: requestMethod,
                headers: requestHeaders
            }
        );

        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        const data = await response.json();

        if (!response.ok) {
            addFrontendMessages(data, [
                "Current Session is not valid",
                "Please login again",
                "Token expired or invalid"
            ]);

            resetSession();
        }

        updateApiResPanelState(data,
            {
                status: response.status,
                headers: {
                    requestHeaders: requestHeaders,
                    responseHeaders: Object.fromEntries(response.headers.entries())
                }
            }
        );

        updatePillApiResBtns(apiResBodyBtn);
        updateInfoTagStatus(response);
        updateResponseTime(responseTime);

    } catch (error) {

        updateConnectionErrorInfoTags();

        console.log(error);
    }

});



showAllUsersPublicBtn.addEventListener("click", async function () {
    const requestMethod = "GET";

    updateApiResponseSubHeader(requestMethod, badgeClassesStyles.GET, endPointsURL.showAllUsersPublic);

    try {
        const startTime = performance.now();
        const response = await fetch(endPointsURL.showAllUsersPublic,
            {
                method: requestMethod
            }
        );
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        const data = await response.json();

        updateApiResPanelState(data,
            {
                status: response.status,
                headers: {
                    responseHeaders: Object.fromEntries(response.headers.entries())
                }
            }
        );

        updatePillApiResBtns(apiResBodyBtn);
        updateInfoTagStatus(response);
        updateResponseTime(responseTime);

    } catch (error) {

        updateConnectionErrorInfoTags();

        console.log(error);
    }
});



subHeaderTokenBtn.addEventListener("click", async function () {
    updateTokenPillBtn();
});



apiResBodyBtn.addEventListener("click", function () {
    apiResPanelState.selectedButton = apiResBodyBtn;
    updatePillApiResBtns();
    showContentInApiResScreen();
});



apiResHeadersBtn.addEventListener("click", function () {
    apiResPanelState.selectedButton = apiResHeadersBtn;
    updatePillApiResBtns();
    showContentInApiResScreen();
});



apiResPayloadBtn.addEventListener("click", function () {
    apiResPanelState.selectedButton = apiResPayloadBtn;
    updatePillApiResBtns();
    showContentInApiResScreen();
});



apiResCopyBtn.addEventListener("click", async function () {
    await navigator.clipboard.writeText(apiResPanelScreen.textContent);
});



apiResClearBtn.addEventListener("click", function () {
    apiResPanelScreen.textContent = "";
});



//------------------------------------ Functions ------------------------------------------//



async function checkBackendStatus() {
    try {
        const response = await fetch(endPointsURL.showAllUsersPublic);

        if (response.ok) {
            backendStatusDot.className = "text-green-400";
            backendStatusText.textContent = "localhost:8081 online";
        } else {
            backendStatusDot.className = "text-yellow-400";
            backendStatusText.textContent = "localhost:8081 error";
        }
    } catch (error) {
        backendStatusDot.className = "text-red-400";
        backendStatusText.textContent = "localhost:8081 offline";
    }
}



function showContentInApiResScreen() {
    const textColorAndSize = getStatusStyle(apiResPanelState.response.status).classes + " text-base";

    switch (apiResPanelState.selectedButton) {
        case apiResBodyBtn:
            apiResPanelScreen.textContent = JSON.stringify(apiResPanelState.response.body,
                                                                      null, 2);
            apiResPanelScreen.className = textColorAndSize
            break;

        case apiResHeadersBtn:
            apiResPanelScreen.textContent = JSON.stringify({
                frontendHeaders: apiResPanelState.request.headers,
                backendHeaders: apiResPanelState.response.headers
            }, null, 2);

            apiResPanelScreen.className = textColorAndSize
            break;

        case apiResPayloadBtn:
            apiResPanelScreen.textContent = JSON.stringify(apiResPanelState.request.bodyResponse,
                                                                  null, 2);
            apiResPanelScreen.className = textColorAndSize
            break;
    }
}



function paintSelectedBtn(button) {
    const defaultStyle = "border-[#263449] text-slate-600";
    switch (button) {
        case apiResBodyBtn:
            apiResHeadersBtn.className = defaultStyle;
            apiResPayloadBtn.className = defaultStyle;
            break;

        case apiResHeadersBtn:
            apiResBodyBtn.className = defaultStyle;
            apiResPayloadBtn.className = defaultStyle;
            break;

        case apiResPayloadBtn:
            apiResBodyBtn.className = defaultStyle;
            apiResHeadersBtn.className = defaultStyle;
            break;
    }
    button.className = "border-cyan-300 text-cyan-300";
}



function updateResponseTime(responseTime) {
    if (responseTime > 0 && responseTime < 300) {
        apiResInfoTagTime.textContent = `${responseTime} ms`;
        apiResInfoTagTime.className = "text-green-400";
    } else if (responseTime >= 300 && responseTime < 1000) {
        apiResInfoTagTime.textContent = `${responseTime} ms`;
        apiResInfoTagTime.className = "text-yellow-400";
    } else if (responseTime >= 1000)  {
        apiResInfoTagTime.textContent = `${responseTime} ms`;
        apiResInfoTagTime.className = "text-red-400";
    } else {
        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-cyan-400 border-cyan-400";
    }
}



function updateConnectionErrorInfoTags() {
    apiResInfoTagStatus.textContent = "Connection failed";
    apiResInfoTagStatus.className = "text-red-400 border-red-400";

    apiResInfoTagTime.textContent = "--";
    apiResInfoTagTime.className = "text-red-400";
}



function updateApiResponseSubHeader(method, styleClass, url) {
    apiResMethBadge.textContent = method;
    apiResMethBadge.className = styleClass;

    apiResUrl.textContent = url;
}



function addFrontendMessages(...messages) {
    apiResPanelState.response.body.backendMessage = [
        apiResPanelState.response.body.backendMessage ?? "No backend message",
    ];

    apiResPanelState.response.body.frontendMessage = [
        ...messages
    ];
}



function showLoginRequiredState() {
    subHeaderTokenDot.className = "text-orange-400";
    subHeaderTokenText.className = "text-orange-400";
    subHeaderTokenText.textContent = "Login to get valid";

    apiResInfoTagStatus.textContent = "401 Unauthorized";
    apiResInfoTagStatus.className = "text-orange-400";

    apiResInfoTagTime.textContent = "--";
    apiResInfoTagTime.className = "text-orange-400";

    apiResInfoTagAccessLvl.textContent = "Login to get";
    apiResInfoTagAccessLvl.className = "text-orange-400";
}



function updateApiResPanelState() {
    apiResPanelState.response.status = apiResPanelState.response.raw.status;
    apiResPanelState.response.headers = Object.fromEntries(apiResPanelState.response.raw.headers.entries());
}



function updatePillApiResBtns() {
    const button = apiResPanelState.selectedButton;
    paintSelectedBtn(button);
}



function blockIfNotAdmin() {
    if (currentUserRole === "ADMIN") {
        return false;
    }

    apiResInfoTagStatus.textContent = "403 Forbidden";
    apiResInfoTagStatus.className = "text-red-400";

    apiResInfoTagTime.textContent = "--";
    apiResInfoTagTime.className = "text-red-400";

    updateApiResPanelState(
        {
            backendMessage: [
                "Admin access level is required",
                "Please login as ADMIN and try again"
            ]
        },
        {
            status: 403
        }
    );

    updatePillApiResBtns(apiResBodyBtn);
    return true;
}



function blockIfNotLoggedIn(requiredRole = "USER") {
    if (currentToken !== null) {
        return false;
    }

    updateApiResPanelState({
        backendMessage: [
            `Successful ${requiredRole}-login is required`,
            `Please login as ${requiredRole} and try again`
        ]
    });

    showLoginRequiredState();
    updatePillApiResBtns(apiResBodyBtn);
    return true;
}



function hasEmptyInputs(inputs) {
    return inputs.some(input => !input.value.trim());
}



function getStatusStyle(statusCode){
    return statusStyles[statusCode] || {
        text: "?-Status",
        classes: "text-cyan-400 border-cyan-400"
    }
}



function resetSession() {
    currentToken = null;
    currentUserId = null;
    currentUserRole = null;

    updatePillTokenArea();
    updateInfoTagAccessLevel();
}



function setSession() {
    currentToken = apiResPanelState.response.body.token;
    currentUserId = apiResPanelState.response.body.userId;
    currentUserRole = apiResPanelState.response.body.userRole;

    updatePillTokenArea();
    updateInfoTagAccessLevel();
}



function updatePillTokenArea() {
    const style = getStatusStyle(apiResPanelState.response.status);
    const status = apiResPanelState.response.status;
    updateTokenPillDot(style);
    updateTokenPillText(status, style);
}
function updateTokenPillDot(style) {
    subHeaderTokenDot.className = style.classes;
}
function updateTokenPillText(status, style) {
    if (status === 200 && currentToken !== null) {
        subHeaderTokenText.textContent = "valid";
    } else if(status !== 200 && currentToken == null) {
        subHeaderTokenText.textContent = "Login failed";
    } else if(currentToken === null){
        subHeaderTokenText.textContent = "Login to get";
    }
    subHeaderTokenText.className = style.classes;
}
async function updateTokenPillBtn() {
    if (!currentToken) {
        console.log("No token to copy");
        return;
    }

    await navigator.clipboard.writeText(currentToken);
    console.log("Token copied");
}



function updateApiResSubheaderPill() {
    const method = apiResPanelState.request.method;
    const badge = badgeClassesStyles[method];
    const url = apiResPanelState.request.url;
    updateApiResBadge(method, badge);
    updateApiResUrl(url);
}
function updateApiResBadge(method, badge) {
    apiResMethBadge.textContent = method;
    apiResMethBadge.className = badge;
}
function updateApiResUrl(url) {
    apiResUrl.textContent = url;
}



function updateInfoAreaTags() {
    const status = apiResPanelState.response.status;
    const statusStyle = getStatusStyle(status);
    const responseTime = apiResPanelState.fetchSpeed.responseTime;

    updateInfoTagStatus(status, statusStyle);
    updateInfoTagTime(responseTime);
}
function updateInfoTagStatus(status, statusStyle) {
    apiResInfoTagStatus.textContent = `${status} ${statusStyle.text}`;
    apiResInfoTagStatus.className = statusStyle.classes;
}
function updateInfoTagTime(responseTime) {
    if (responseTime > 0 && responseTime < 300) {
        apiResInfoTagTime.textContent = `${responseTime} ms`;
        apiResInfoTagTime.className = "text-green-400";
    } else if (responseTime >= 300 && responseTime < 1000) {
        apiResInfoTagTime.textContent = `${responseTime} ms`;
        apiResInfoTagTime.className = "text-yellow-400";
    } else if (responseTime >= 1000)  {
        apiResInfoTagTime.textContent = `${responseTime} ms`;
        apiResInfoTagTime.className = "text-red-400";
    } else {
        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = getStatusStyle(apiResPanelState.response.status).classes;
    }
}
function updateInfoTagAccessLevel() {
    const style = getStatusStyle(apiResPanelState.response.status).classes;
    const userRole = apiResPanelState.response.body.userRole || "Login to get";

    if (userRole === "ADMIN") {
        apiResInfoTagAccessLvl.className = "text-amber-400";
    } else if (userRole === "USER") {
        apiResInfoTagAccessLvl.className = "text-sky-400";
    } else {
        apiResInfoTagAccessLvl.className = style;
    }

    apiResInfoTagAccessLvl.textContent = userRole;
}




function renderApiResponse(){
    updateApiResSubheaderPill();
    updateInfoAreaTags();
    updatePillApiResBtns();
    showContentInApiResScreen();
}
import './style.css'


const statusStyles = {
    0: {
        text: "fetch-fail",
        classes: "text-red-400 border-red-400"
    },
    200: {
        text: "OK",
        classes: "text-green-400 border-green-400"
    },
    201: {
        text: "Created",
        classes: "text-green-400 border-green-400"
    },
    204: {
        text: "No Content",
        classes: "text-green-400 border-green-400"
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
        status: null,
        headers: "Empty",
        body: /** @type {Record<string, any>} */( {
            backendMessage: "Empty"
        } )
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


setTimeout(async () => {
    await checkBackendStatus();
}, 500);

paintSelectedBtn();

loginBtn.addEventListener("click", async function () {
    setApiRequest(endPointsURL.login,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
            userName: loginUserName.value,
            userPin: loginUserPin.value
        },
        bodyResponse: {
            userName: loginUserName.value,
            userPin: "*********"
        }
    });

    try {
        await sendApiRequest();
        updateApiResPanelState();

        if (apiResPanelState.response.raw.ok) {
            setSession();
        }

        renderApiResponse();

    } catch (error) {
        catchResponse(error);
    }
});



registerUserBtn.addEventListener("click", async function () {
    setApiRequest(endPointsURL.registerUser,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
            userName: registerUserUserName.value,
            userPin: registerUserUserPin.value
        },
        bodyResponse: {
            userName: registerUserUserName.value,
            userPin: "*********"
        }
    });

    try {
        await sendApiRequest();
        updateApiResPanelState();

        if (apiResPanelState.response.raw.ok) {
            addFrontendMessages(
                "User registered successfully",
                "Login with new user if you wish"
            );
        }

        renderApiResponse();

    } catch (error) {
        catchResponse(error);
    }
});



changePinBtn.addEventListener("click", async function () {
    setApiRequest(endPointsURL.changePin(currentUserId),{
        method: "PATCH",
        headers: {
            "Authorization": "Bearer " + currentToken,
            "Content-Type": "application/json"
        },
        body: {
            userName: changePinUserName.value,
            userPin: changePinUserPin.value,
            newUserPin: changePinNewUserPin.value
        },
        bodyResponse: {
            userName: changePinUserName.value,
            userPin: "*********",
            newUserPin: "*********"
        }
    });

    if(blockIfNotLoggedIn([
        "Successful login is required",
        "before changing PIN",
        "login and try again"
    ])) return;

    try {
        await sendApiRequest();
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
        catchResponse(error);
    }
});



showUsersAdminBtn.addEventListener("click", async function () {
    setApiRequest(endPointsURL.showAllUsersAdmin,{
        headers: { "Authorization": "Bearer " + currentToken }
    });

    if(blockIfNotLoggedIn([
        "Successful Admin login is required",
        "before checking users",
        "login as Admin and try again"
    ])) return;

    if(blockIfNotAdmin([
        "Successful Admin login is required",
        "before checking users",
        "login as Admin and try again"
    ])) return;

    try {
        await sendApiRequest();
        updateApiResPanelState();
        renderApiResponse();

    } catch (error) {
        catchResponse(error);
    }
});



searchUserByIdBtn.addEventListener("click", async function () {
    setApiRequest(endPointsURL.searchUserById(searchUserByIdUserId.value),{
       headers: { "Authorization": "Bearer " + currentToken }
    });

    if(blockIfNotLoggedIn([
        "Successful Admin login is required",
        "before searching users",
        "login as Admin and try again"
    ])) return;

    if(blockIfNotAdmin([
        "Successful Admin login is required",
        "before searching users",
        "login as Admin and try again"
    ])) return;

    try {
        await sendApiRequest();
        updateApiResPanelState();
        renderApiResponse();

    } catch (error) {
        catchResponse(error);
    }
});



changeUserRoleBtn.addEventListener("click", async function () {
    setApiRequest(endPointsURL.changeUserRole(changeUserRoleUserId.value),{
        method: "PATCH",
        headers: {
            "Authorization": "Bearer " + currentToken,
            "Content-Type": "application/json"
        },
        body: { userRole: changeUserRoleUserRole.value },
        bodyResponse: { userRole: changeUserRoleUserRole.value }
    });

    if(blockIfNotLoggedIn([
        "Successful Admin login is required",
        "before changing a users role",
        "login as Admin and try again"
    ])) return;

    if(blockIfNotAdmin([
        "Successful Admin login is required",
        "before changing a users role",
        "login as Admin and try again"
    ])) return;

    try {
        await sendApiRequest();

        if (apiResPanelState.response.raw.ok &&
            Number(changeUserRoleUserId.value) === currentUserId) {
            addFrontendMessages(
                "Access-lvl was changed",
                "Login is required",
                "Please login again"
            );
            resetSession();
        }

        updateApiResPanelState();
        renderApiResponse();

    } catch (error) {
        catchResponse(error);
    }
});



deleteUserByIdBtn.addEventListener("click", async function () {
    setApiRequest(endPointsURL.deleteUser(deleteUserByIdUserId.value),{
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + currentToken,
            "Content-Type": "application/json"
        },
        body: {
            userName: deleteUserByIdUserName.value,
            userPin: deleteUserByIdUserPin.value
        },
        bodyResponse: {
            userName: deleteUserByIdUserName.value,
            userPin: "*********"
        }
    });

    if(blockIfNotLoggedIn([
        "Successful login is required",
        "before deleting your account",
        "login and try again"
    ])) return;

    if (!confirm("Delete your account permanently?")) { return; }
    try {
        await sendApiRequest();

        if (apiResPanelState.response.raw.ok) {
            addFrontendMessages(
                "Login is required",
                "after deleting your account",
                "Login with a new account or",
                "Register a new account"
            );
            resetSession();
        }

        updateApiResPanelState();
        renderApiResponse();


    } catch (error) {
        catchResponse(error);
    }

});



currentSessionBtn.addEventListener("click", async function () {
    setApiRequest(endPointsURL.currentSession,{
        headers: { "Authorization": "Bearer " + currentToken }
    });

    if(blockIfNotLoggedIn([
        "Successful login is required",
        "before checking current session",
        "login and try again"
    ])) return;

    try {
        await sendApiRequest();
        updateApiResPanelState();
        renderApiResponse();

    } catch (error) {
        catchResponse(error);
    }

});



showAllUsersPublicBtn.addEventListener("click", async function () {
    setApiRequest(endPointsURL.showAllUsersPublic);

    try {
        await sendApiRequest();
        updateApiResPanelState();
        renderApiResponse();

    } catch (error) {
        catchResponse(error);
    }
});



subHeaderTokenBtn.addEventListener("click", async function () {
    await updateTokenPillBtn();
});



apiResBodyBtn.addEventListener("click", function () {
    updatePillApiResBtn(apiResBodyBtn);
   });



apiResHeadersBtn.addEventListener("click", function () {
    updatePillApiResBtn(apiResHeadersBtn);
});



apiResPayloadBtn.addEventListener("click", function () {
    updatePillApiResBtn(apiResPayloadBtn);
});



apiResCopyBtn.addEventListener("click", async function () {
    await navigator.clipboard.writeText(apiResPanelScreen.textContent);
});



apiResClearBtn.addEventListener("click", function () {
    apiResPanelScreen.textContent = "";
});



//---------- Functions -------------------------- Functions ------------------------- Functions -------------//



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



function paintSelectedBtn() {
    const defaultStyle = "border-[#263449] text-slate-600";
    const button = apiResPanelState.selectedButton;
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



function addFrontendMessages(...messages) {
    const backendMessage = apiResPanelState.response.body.backendMessage ?? "Empty";

    apiResPanelState.response.body.backendMessage =
        Array.isArray(backendMessage) ? backendMessage : [backendMessage];

    apiResPanelState.response.body.frontendMessage = messages;
}



function updateApiResPanelState() {
    apiResPanelState.response.status = apiResPanelState.response.raw.status;
    apiResPanelState.response.headers = Object.fromEntries(apiResPanelState.response.raw.headers.entries());
}



function updatePillApiResBtn(button) {
    apiResPanelState.selectedButton = button;
    paintSelectedBtn();
    showContentInApiResScreen();
}



function setGuardResponse(status, message) {
    apiResPanelState.response.raw = null;
    apiResPanelState.response.status = status;
    apiResPanelState.response.headers = "Empty";
    apiResPanelState.response.body = {
        backendMessage: "Empty",
        frontendMessage: message
    };

    apiResPanelState.fetchSpeed.startTime = 0;
    apiResPanelState.fetchSpeed.endTime = 0;
}



function blockIfNotAdmin(message) {
    if (currentUserRole !== "ADMIN") {
        setGuardResponse(403, message);
        renderApiResponse();
        return true;
    }
    return false;
}



function blockIfNotLoggedIn(message) {
    if(currentToken === null){
        setGuardResponse(401, message);
        resetSession();
        renderApiResponse();
        return true;
    }
    return false;
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
    if (currentToken != null) {
        subHeaderTokenDot.className = "text-green-400";
    } else {
        subHeaderTokenDot.className = style.classes;
    }
}
function updateTokenPillText(status, style) {
    if (currentToken != null) {
        subHeaderTokenText.textContent = "valid";
        subHeaderTokenText.className = "text-green-400";
    } else {
        subHeaderTokenText.textContent = "Login to get";
        subHeaderTokenText.className = style.classes;
    }
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
    updateInfoTagAccessLevel();
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
    const userRole = currentUserRole || "Login to get";

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
    apiResPanelState.selectedButton = apiResBodyBtn;

    updatePillTokenArea();
    updateApiResSubheaderPill();
    updateInfoAreaTags();
    paintSelectedBtn();
    showContentInApiResScreen();
}



function catchResponse(error) {
    apiResPanelState.response.raw = null;
    apiResPanelState.response.status = 0;
    apiResPanelState.response.headers = "Empty";
    apiResPanelState.response.body = {
        backendMessage: ["Empty"],
        frontendMessage: [
            "Fetch failed",
            error.name ?? "Unknown error name",
            error.message ?? "No backend error message"
        ]
    };

    apiResPanelState.fetchSpeed.startTime = 0;
    apiResPanelState.fetchSpeed.endTime = 0;

    renderApiResponse();
}



function setApiRequest(
    url,
    {
        method,
        headers,
        body,
        bodyResponse
    } = {}
) {
    apiResPanelState.request.url = url;
    apiResPanelState.request.method = method ?? "GET";
    apiResPanelState.request.headers = headers ?? "Empty";
    apiResPanelState.request.body = body ?? "Empty";
    apiResPanelState.request.bodyResponse = bodyResponse ?? "Empty";
}



async function sendApiRequest() {
    const fetchOptions = {
        method: apiResPanelState.request.method
    };

    if (apiResPanelState.request.headers !== "Empty") {
        fetchOptions.headers = apiResPanelState.request.headers;
    }

    if (apiResPanelState.request.body !== "Empty") {
        fetchOptions.body = JSON.stringify(apiResPanelState.request.body);
    }

    apiResPanelState.fetchSpeed.startTime = performance.now();
    apiResPanelState.response.raw = await fetch(
        apiResPanelState.request.url, fetchOptions
    );
    apiResPanelState.fetchSpeed.endTime = performance.now();

    if (apiResPanelState.response.raw.status === 204) {
        apiResPanelState.response.body ={backendMessage: ["Empty"]};
    } else {
        apiResPanelState.response.body = await apiResPanelState.response.raw.json();
    }
}
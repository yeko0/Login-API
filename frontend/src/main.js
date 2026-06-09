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

const apiResShowTextArea = document.getElementById("api-response-show-text-area");

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
let lastApiResponse = null;
let lastRequest = null;

paintApiResBtn(apiResBodyBtn);

setTimeout(() => {
    checkBackendStatus();
}, 500);

apiResInfoTagAccessLvl.textContent = "Login to get";
apiResInfoTagAccessLvl.className = "text-cyan-400";
subHeaderTokenDot.className = "text-cyan-400";
subHeaderTokenText.className = "text-cyan-400";
subHeaderTokenText.textContent = "Login to get valid";



loginBtn.addEventListener("click", async function () {
    const requestMethod = "POST"
    const requestHeaders = {"Content-Type": "application/json"}
    const requestBody = {
        userName: loginUserName.value,
        userPin: loginUserPin.value
    }
    const requestBodyResponse = {
        userName: requestBody.userName,
        userPin: "*********"
    };

    updateApiResponseSubHeader(requestMethod, badgeClassesStyles.POST, endPointsURL.login);

    try {
        const startTime = performance.now();
        const response = await fetch(endPointsURL.login,
            {
                method: requestMethod,
                headers: requestHeaders,
                body: JSON.stringify(requestBody),
            },
        );
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        const data = await response.json();

        if (response.ok) {
            setSession(data);
        }

        saveApiResponse(data, {
            status: response.status,
            headers: {
                requestHeaders: requestHeaders,
                responseHeaders: Object.fromEntries(response.headers.entries())
            },
            request: requestBodyResponse
        });

        showResponsePanel(apiResBodyBtn);
        updateInfoTagStatus(response);
        updateResponseTime(responseTime);

        console.log(response);
        console.log(data);

    } catch (error) {

        updateConnectionErrorInfoTags();

        console.log(error);
    }
});



registerUserBtn.addEventListener("click", async function () {
    const requestMethod = "POST";
    const requestHeaders = {"Content-Type": "application/json"};
    const requestBody = {
        userName: registerUserUserName.value,
        userPin: registerUserUserPin.value
    }
    const requestBodyResponse = {
        userName: requestBody.userName,
        userPin: "*********"
    };

    updateApiResponseSubHeader(requestMethod, badgeClassesStyles.POST, endPointsURL.registerUser);

    try {
        const startTime = performance.now();
        const response = await fetch(endPointsURL.registerUser,
            {
                method: requestMethod,
                headers: requestHeaders,
                body: JSON.stringify(requestBody),
            },
        );
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        const data = await response.json();

        saveApiResponse(data, {
            status: response.status,
            headers: {
                requestHeaders: requestHeaders,
                responseHeaders: Object.fromEntries(response.headers.entries())
            },
            request: requestBodyResponse
        });

        showResponsePanel(apiResBodyBtn);
        updateInfoTagStatus(response);
        updateResponseTime(responseTime);

        console.log(response);
        console.log(data);

    } catch (error) {

        updateConnectionErrorInfoTags();

        console.log(error);
    }
});



changePinBtn.addEventListener("click", async function () {
    const requestMethod = "PATCH";
    const requestHeaders = {
        "Authorization": "Bearer " + currentToken,
        "Content-Type": "application/json"
    };
    const requestBody = {
        userName: changePinUserName.value,
        userPin: changePinUserPin.value,
        newUserPin: changePinNewUserPin.value
    };
    const requestBodyResponse = {
        userName: requestBody.userName,
        userPin: "*********",
        newUserPin: "*********"
    };
    const changePinURLrequest = endPointsURL.changePin(currentUserId);

    updateApiResponseSubHeader(requestMethod, badgeClassesStyles.PATCH, changePinURLrequest);

    if (currentToken === null || currentUserId === null) {

        saveApiResponse(
            {
                message: [
                    "Successful login is required",
                    "before changing pin",
                    "Please login and try again"
                ]
            },
            {
                headers: {requestHeaders: requestHeaders},
                request: requestBodyResponse
            }
        );

        showLoginRequiredState();
        showResponsePanel(apiResBodyBtn);
        return;
    }

    try {
        const startTime = performance.now()
        const response = await fetch(changePinURLrequest,
            {
                method: requestMethod,
                headers: requestHeaders,
                body: JSON.stringify(requestBody),
            });
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        const data = await response.json();

        if (response.ok) {
            addFrontendMessages(data, [
                "After changing pin login is required",
                "Login again for new token and access level",
                "Login again with new password/pin"
            ]);

            resetSession();
        }

        saveApiResponse(data, {
            status: response.status,
            headers: {
                requestHeaders: requestHeaders,
                responseHeaders: Object.fromEntries(response.headers.entries())
            },
            request: requestBodyResponse
        });

        showResponsePanel(apiResBodyBtn);
        updateInfoTagStatus(response);
        updateResponseTime(responseTime);

        console.log(response);
        console.log(data);

    } catch (error) {

        updateConnectionErrorInfoTags();

        console.log(error);
    }

});



showUsersAdminBtn.addEventListener("click", async function () {
    const requestMethod = "GET";
    const requestHeaders = {"Authorization": "Bearer " + currentToken};

    updateApiResponseSubHeader(requestMethod, badgeClassesStyles.GET, endPointsURL.showAllUsersAdmin);

    if (currentToken === null) {

        saveApiResponse(
            {
                message: [
                    "Successful Admin-login is required",
                    "before checking users in database",
                    "Please login as ADMIN and try again"
                ]
            }
        );

        showLoginRequiredState();
        showResponsePanel(apiResBodyBtn);
        return;
    }

    if (currentUserRole !== "ADMIN") {

        apiResInfoTagStatus.textContent = "403 Forbidden";
        apiResInfoTagStatus.className = "text-red-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-red-400";

        saveApiResponse(
            {
                message: [
                    "Admin Access level is required",
                    "before checking users in database",
                    "Please login as ADMIN and try again"
                ]
            },
            {status: 403}
        );

        showResponsePanel(apiResBodyBtn);
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

        saveApiResponse(data,
            {
                status: response.status,
                headers: {
                    requestHeaders: requestHeaders,
                    responseHeaders: Object.fromEntries(response.headers.entries())
                }
            }
        );

        showResponsePanel(apiResBodyBtn);
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

    if (currentToken === null) {

        saveApiResponse(
            {
                message: [
                    "Successful Admin-login is required",
                    "before searching a user in database",
                    "Please login as ADMIN and try again"
                ]
            }
        );

        showLoginRequiredState();
        showResponsePanel(apiResBodyBtn);
        return;
    }

    if (currentUserRole !== "ADMIN") {

        apiResInfoTagStatus.textContent = "403 Forbidden";
        apiResInfoTagStatus.className = "text-red-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-red-400";

        saveApiResponse(
            {
                message: [
                    "Admin Access level is required",
                    "before searching a user in database",
                    "Please login as ADMIN and try again"
                ]
            },
            {
                status: 403
            }
        );

        showResponsePanel(apiResBodyBtn);
        return;
    }

    if (searchUserByIdUserId.value === "" || searchUserByIdUserId.value === null) {

        apiResInfoTagStatus.textContent = "400 Bad Request";
        apiResInfoTagStatus.className = "text-yellow-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-yellow-400";

        saveApiResponse(
            {
                message: [
                    "User ID to search is required",
                    "Input area can't be empty",
                    "Please enter a user ID in the input area"
                ]
            },
            {
                status: 400
            }
        );

        showResponsePanel(apiResBodyBtn);
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

        saveApiResponse(data,
            {
                status: response.status,
                headers: {
                    requestHeaders: requestHeaders,
                    responseHeaders: Object.fromEntries(response.headers.entries())
                }
            }
        );

        showResponsePanel(apiResBodyBtn);
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

    if (currentToken === null) {
        showLoginRequiredState();

        saveApiResponse(
            {
                message: [
                    "Successful Admin-login is required",
                    "before changing user role",
                    "Please login as ADMIN and try again"
                ]
            }
        );

        showResponsePanel(apiResBodyBtn);
        return;
    }

    if (currentUserRole !== "ADMIN") {
        apiResInfoTagStatus.textContent = "403 Forbidden";
        apiResInfoTagStatus.className = "text-red-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-red-400";

        saveApiResponse(
            {
                message: [
                    "Admin Access level is required",
                    "before searching a user in database",
                    "Please login as ADMIN and try again"
                ]
            },
            {
                status: 403,
            }
        );

        showResponsePanel(apiResBodyBtn);
        return;
    }

    if( changeUserRoleUserRole.value === "" || changeUserRoleUserRole.value === null ||
        changeUserRoleUserId.value === "" || changeUserRoleUserId.value === null ){
        apiResInfoTagStatus.textContent = "400 Bad Request";
        apiResInfoTagStatus.className = "text-yellow-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-yellow-400";

        saveApiResponse(
            {
                message: [
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

        showResponsePanel(apiResBodyBtn);
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

        saveApiResponse(data,
            {
                status: response.status,
                headers: {
                    requestHeaders: requestHeaders,
                    responseHeaders: Object.fromEntries(response.headers.entries())
                },
                request: requestBody
            }
        );

        showResponsePanel(apiResBodyBtn);
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

    if (currentToken === null) {
        showLoginRequiredState();

        saveApiResponse(
            {
                message: [
                    "Successful login is required",
                    "before deleting a user in database",
                    "Please login and try again"
                ]
            }
        );

        showResponsePanel(apiResBodyBtn);
        return;
    }

    if( deleteUserByIdUserId.value === "" || deleteUserByIdUserId.value === null ||
        deleteUserByIdUserName.value === "" || deleteUserByIdUserName.value === null ||
        deleteUserByIdUserPin.value === "" || deleteUserByIdUserPin.value === null ){

        apiResInfoTagStatus.textContent = "400 Bad Request";
        apiResInfoTagStatus.className = "text-yellow-400";

        apiResInfoTagTime.textContent = "--";
        apiResInfoTagTime.className = "text-yellow-400";

        saveApiResponse(
            {
                message: [
                    "Confirmation of ID, name and PIN are required",
                    "Input areas can't be empty",
                    "Please fill all fields and try again"
                ]
            },
            {
                status: 400
            }
        );

        showResponsePanel(apiResBodyBtn);
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

        saveApiResponse(data,
            {
                status: response.status,
                headers: {
                    requestHeaders: requestHeaders,
                    responseHeaders: Object.fromEntries(response.headers.entries())
                },
                request: requestBodyResponse
            }
        );

        showResponsePanel(apiResBodyBtn);
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

    if (currentToken === null) {
        showLoginRequiredState();

        saveApiResponse(
            {
                message: [
                    "Successful login is required",
                    "before checking Token",
                    "Please login and try again"
                ]
            }
        );

        showResponsePanel(apiResBodyBtn);
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

        saveApiResponse(data,
            {
                status: response.status,
                headers: {
                    requestHeaders: requestHeaders,
                    responseHeaders: Object.fromEntries(response.headers.entries())
                }
            }
        );

        showResponsePanel(apiResBodyBtn);
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

        saveApiResponse(data,
            {
                status: response.status,
                headers: {
                    responseHeaders: Object.fromEntries(response.headers.entries())
                }
            }
        );

        showResponsePanel(apiResBodyBtn);
        updateInfoTagStatus(response);
        updateResponseTime(responseTime);

    } catch (error) {

        updateConnectionErrorInfoTags();

        console.log(error);
    }
});



subHeaderTokenBtn.addEventListener("click", async function () {
    if (!currentToken) {
        console.log("No token to copy");
        return;
    }

    await navigator.clipboard.writeText(currentToken);
    console.log("Token copied");
});



apiResBodyBtn.addEventListener("click", function () {
    showResponsePanel(apiResBodyBtn);
});



apiResHeadersBtn.addEventListener("click", function () {
    showResponsePanel(apiResHeadersBtn);
});



apiResPayloadBtn.addEventListener("click", function () {
    showResponsePanel(apiResPayloadBtn);
});



apiResCopyBtn.addEventListener("click", async function () {
    await navigator.clipboard.writeText(apiResShowTextArea.textContent);
});



apiResClearBtn.addEventListener("click", function () {
    apiResShowTextArea.textContent = "";
});



//------------------------------------ Functions ------------------------------------------//



async function checkBackendStatus() {
    try {
        const response = await fetch(endPointsURL.showAllUsersPublic);

        if (response.ok) {
            statusDot.className = "text-green-400";
            statusText.textContent = "localhost:8081 online";
        } else {
            statusDot.className = "text-yellow-400";
            statusText.textContent = "localhost:8081 error";
        }
    } catch (error) {
        statusDot.className = "text-red-400";
        statusText.textContent = "localhost:8081 offline";
    }
}



function renderResponsePanel(selectedApiResBtn, lastApiResponse, request) {
    if (lastApiResponse == null) {
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
    switch (selectedApiResBtn) {
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



function paintApiResBtn(button) {
    switch (button) {
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



function updateInfoTagStatus(response) {
   const statusStyle = statusStyles[response.status];

    if (statusStyle) {
        apiResInfoTagStatus.textContent = response.status +" "+ statusStyle.text;
        apiResInfoTagStatus.className = statusStyle.classes;
    }else {
        apiResInfoTagStatus.textContent = response.status + " Unknown";
        apiResInfoTagStatus.className = "text-slate-400 border-slate-400";
    }
}



function updateResponseTime(responseTime) {
    if (responseTime < 300) {
        apiResInfoTagTime.textContent = `${responseTime} ms`;
        apiResInfoTagTime.className = "text-green-400";
    } else if (responseTime >= 300 && responseTime < 1000) {
        apiResInfoTagTime.textContent = `${responseTime} ms`;
        apiResInfoTagTime.className = "text-yellow-400";
    } else {
        apiResInfoTagTime.textContent = `${responseTime} ms`;
        apiResInfoTagTime.className = "text-red-400";
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



function resetSession() {
    currentToken = null;
    currentUserId = null;
    currentUserRole = null;

    subHeaderTokenDot.className = "text-red-500";
    subHeaderTokenText.className = "text-red-500";
    subHeaderTokenText.textContent = "Login to get valid";

    apiResInfoTagAccessLvl.textContent = "Login to get";
    apiResInfoTagAccessLvl.className = "text-red-500";
}



function setSession(data) {
    currentToken = data.token;
    currentUserId = data.userId;
    currentUserRole = data.userRole;

    subHeaderTokenDot.className = "text-green-400";
    subHeaderTokenText.className = "text-green-400";
    subHeaderTokenText.textContent = "Valid";

    if (data.userRole === "ADMIN") {
        apiResInfoTagAccessLvl.textContent = "Admin";
        apiResInfoTagAccessLvl.className = "text-amber-400";
    } else if (data.userRole === "USER") {
        apiResInfoTagAccessLvl.textContent = "User";
        apiResInfoTagAccessLvl.className = "text-sky-400";
    }
}



function addFrontendMessages(data, messages) {
    data.message = [
        data.message ?? "No backend message",
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



function saveApiResponse(data, options = {} ){
    const {
        status = 401,
        headers = {},
        request = "Empty"
    } = options;

    const finalHeaders = {
        requestHeaders: "Empty",
        responseHeaders: "Empty",
        ...headers
    };

    lastApiResponse = {
        data: data,
        response: {
            status: status
        },
        headers: finalHeaders
    };

    lastRequest = request;
}



function showResponsePanel(button) {
    paintApiResBtn(button);
    renderResponsePanel(button, lastApiResponse, lastRequest);
}
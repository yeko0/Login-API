
function maskRequestBody(body) {
    if (!body) {
        return "Empty";
    }

    const safeBody = { ...body };

    if (safeBody.userPin) {
        safeBody.userPin = "********";
    }

    if (safeBody.newUserPin) {
        safeBody.newUserPin = "********";
    }

    return safeBody;
}


function maskRequestHeaders(headers) {
    if (!headers || Object.keys(headers).length === 0) {
        return "Empty";
    }

    const safeHeaders = { ...headers };

    if (safeHeaders.Authorization) {
        safeHeaders.Authorization = "Bearer ********"
    }

    return safeHeaders;
}


function maskResponseBody(body) {
    if (body === null || body === undefined) {
        return "Empty";
    }

    if (Array.isArray(body)) {
        return body;
    }

    const safeBody = { ...body };

    if (safeBody.token) {
        safeBody.token = "********";
    }

    return safeBody;
}



export function prepareApiRequest(setApiResPanelState, apiRequest) {
    const preparedRequest = {
        method: apiRequest.method,
        url: apiRequest.url,
        headers: apiRequest.headers ?? {},
        body: apiRequest.body ?? undefined
    };

    setApiResPanelState((prevState) => ({
        ...prevState,

        request: {
            ...prevState.request,
            method: preparedRequest.method,
            url: preparedRequest.url,
            headers: maskRequestHeaders(preparedRequest.headers),
            body: maskRequestBody(preparedRequest.body)
        }
    }));

    return preparedRequest;
}



export async function sendApiRequest(setApiResPanelState, apiRequest) {
    const startTime = performance.now();
    try {

        const response = await fetch(apiRequest.url, {
            method: apiRequest.method,
            headers: apiRequest.headers ?? {},
            body: apiRequest.body ? JSON.stringify(apiRequest.body) : undefined
        });

        const responseBody = await response.json();
        const endTime = performance.now();

        setApiResPanelState((prevState) => ({
            ...prevState,

            response: {
                ...prevState.response,
                raw: response,
                status: response.status,
                headers: Object.fromEntries(response.headers.entries()),
                body: maskResponseBody(responseBody)
            },

            fetchSpeed: {
                startTime: startTime,
                endTime: endTime,
                responseTime: Math.round(endTime - startTime)
            },

            selectedButton: "body"
        }));

        return {response, responseBody};

    } catch (error) {
        const endTime = performance.now();

        setApiResPanelState((prevState) => ({
            ...prevState,

            response: {
                ...prevState.response,
                raw: null,
                status: 0,
                headers: "Empty",
                body: {
                    backendMessage: ["Empty"],
                    frontendMessage: [
                        "Fetch failed",
                        error.name ?? "Unknown error name",
                        error.message ?? "No backend error message"
                    ]
                }
            },

            fetchSpeed: {
                startTime: startTime,
                endTime: endTime,
                responseTime: Math.round(endTime - startTime)
            },

            selectedButton: "body"
        }));

        return {
            response: {
                ok: false,
                status: 0
            },
            responseBody: {
                backendMessage: ["Empty"],
                frontendMessage: [
                    "Fetch failed",
                    error.name ?? "Unknown error name",
                    error.message ?? "No backend error message"
                ]
            }
        };
    }
}
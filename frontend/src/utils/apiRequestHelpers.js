
export function prepareApiRequest(setApiResPanelState, apiRequest) {
    const preparedRequest = {
        method: apiRequest.method ?? "Error",
        url: apiRequest.url ?? "Error",
        headers: apiRequest.headers ?? "Empty",
        body: apiRequest.body ?? "Empty"
    };

    setApiResPanelState((prevState) => ({
        ...prevState,

        request: {
            ...prevState.request,
            method: preparedRequest.method,
            url: preparedRequest.url,
            headers: preparedRequest.headers,
            body: preparedRequest.body
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
                body: responseBody
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
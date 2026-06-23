
export function setGuardResponse(setApiResPanelState, status, message) {
    setApiResPanelState((prevState) => ({
        ...prevState,

        response: {
            ...prevState.response,
            raw: null,
            status: status,
            headers: "Empty",
            body: {
                backendMessage: ["Empty"],
                frontendMessage: message
            }
        },

        fetchSpeed: {
            startTime: 0,
            endTime: 0,
            responseTime: null
        },

        selectedButton: "body"
    }));
}


export function addFrontendMessages(setApiResPanelState, ...messages) {
    setApiResPanelState((prevState) => {
        const backendMessage = prevState.response.body?.backendMessage ?? ["Empty"];

        return {
            ...prevState,

            response: {
                ...prevState.response,
                body: {
                    ...prevState.response.body,
                    backendMessage: Array.isArray(backendMessage) ? backendMessage : [backendMessage],
                    frontendMessage: messages
                }
            }
        };
    });
}
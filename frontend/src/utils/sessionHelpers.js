
export function resetSession(setAuthSession) {
    setAuthSession({
        token: null,
        userId: null,
        userRole: null
    });
}


export function setSession(setAuthSession, responseBody) {
    setAuthSession({
        token: responseBody.token ?? null,
        userId: responseBody.userId ?? null,
        userRole: responseBody.userRole ?? null
    });
}
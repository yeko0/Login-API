import { setGuardResponse } from "./responsePanelHelpers.js";

export function guardEmptyInputs(setApiResPanelState, ...inputs) {
    const hasEmptyInput = inputs.some((input) => String(input ?? "").trim() === "");

    if (hasEmptyInput) {
        setGuardResponse(setApiResPanelState, 400, [
            "Input fields cannot be empty",
            "Please fill all fields"
        ]);
        return true;
    }
    return false;
}


export function guardNotLoggedIn(setApiResPanelState, authSession){
    if(!authSession.token){
        setGuardResponse(setApiResPanelState, 401, [
            "Successful login is required",
            "Login and try again"
        ]);
        return true;
    }
    return false;
}


export function guardNotAdmin(setApiResPanelState, authSession){
    if (guardNotLoggedIn(setApiResPanelState, authSession)) {
        return true;
    }

    if(authSession.userRole !== "ADMIN") {
        setGuardResponse(setApiResPanelState, 403, [
            "Successful Admin login is required",
            "login as Admin and try again"
        ]);
        return true;
    }
    return false;
}


export function guardInputNotNumber(setApiResPanelState, ...inputs){
    const hasInvalidNumber = inputs.some((input) => {
        const value = Number(String(input ?? "").trim());

        return !Number.isInteger(value) || value <= 0;
    });

    if (hasInvalidNumber) {
        setGuardResponse(setApiResPanelState, 400, [
            "Input not valid",
            "On numbers fields is",
            "only positive integers allowed"
        ]);

        return true;
    }

    return false;
}
import { setGuardResponse } from "./responsePanelHelpers";

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
import { useState } from "react";
import { prepareApiRequest, sendApiRequest} from "../utils/apiRequestHelpers.js";
import { guardEmptyInputs } from "../utils/guards.js";
import { addFrontendMessages } from "../utils/responsePanelHelpers.js";

export default function RegisterUserCard(props) {
    const setApiResPanelState = props.setApiResPanelState;
    const [userName, setUserName] = useState("");
    const [userPin, setUserPin] = useState("");

    async function handleRegisterUserClick() {
        const request = prepareApiRequest(setApiResPanelState, {
            method: "POST",
            url: "http://localhost:8081/users",
            headers: {"Content-Type": "application/json"},
            body: {
                userName: userName,
                userPin: userPin
            }
        })

        if(guardEmptyInputs(setApiResPanelState, userName, userPin)) { return; }
        const { response } = await sendApiRequest(setApiResPanelState, request);

        if(response.ok) {
            addFrontendMessages(setApiResPanelState,
                "User registered successfully",
                "Login with new user if you wish"
            );
        }
    }

    return (
        <div className="shrink-0 w-fit grid items-center p-4 border-t-3 border-t-cyan-300
                  border-x-2 border-b-2 border-x-[#263449] border-b-[#263449] rounded-xl">

            <div className="flex justify-between mb-5 font-bold">
                <span className="bg-cyan-950 text-xs text-cyan-400
                    border-2 border-cyan-400 rounded-full px-3 py-1">POST</span>

                <span className="bg-teal-950 text-xs text-teal-400
                    border-2 border-teal-400 rounded-full px-3 py-1">Public</span>
            </div>


            <div> {/* Card Header */}
                <span className="text-2xl font-bold">Register User</span>
                <p className="text-slate-500">Create a user with the default USER role</p>
            </div>


            <div className="mt-5 w-70"> {/* Card input userName */}
                <label htmlFor="register-user-userName">User name</label> <br/>
                <input id="register-user-userName" autoComplete="off" placeholder="Enter user name"
                       value={userName} onChange={(event) => setUserName(event.target.value)}
                       className="placeholder:text-slate-500 focus:outline-0 focus:border-cyan-400
                         border text-sm text-cyan-400 border-teal-400 rounded-lg pl-2 w-full py-1 mt-2"/>
            </div>


            <div className="mt-5 w-70"> {/* Card input user pin */}
                <label htmlFor="register-user-userPin">User Pin</label> <br/>
                <input id="register-user-userPin" type="password" autoComplete="off" placeholder="Enter user pin"
                       value={userPin} onChange={(event) => setUserPin(event.target.value)}
                       className="placeholder:text-slate-500 focus:outline-0 focus:border-cyan-400
                         border text-sm text-cyan-400 border-teal-400 rounded-lg pl-2 w-full py-1 mt-2"/>
            </div>


            <div className="flex mt-6 gap-5">
                <button id="register-user-btn" onClick={handleRegisterUserClick} className="transition-colors
                    hover:bg-cyan-900 cursor-pointer text-sm font-bold bg-cyan-600 rounded-lg px-5 pb-1.5 pt-1">Register
                </button>
                <p className="text-sm text-slate-500 pt-1">Creates a user in the database</p>
            </div>
        </div>
    );
}
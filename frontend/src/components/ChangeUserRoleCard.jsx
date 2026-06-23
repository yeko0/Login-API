import { useState } from "react";
import { guardEmptyInputs, guardNotAdmin, guardInputNotNumber } from "../utils/guards.js";
import { prepareApiRequest, sendApiRequest } from "../utils/apiRequestHelpers.js";
import { addFrontendMessages } from "../utils/responsePanelHelpers.js"

export default function ChangeUserRoleCard(props) {
    const authSession = props.authSession;
    const setAuthSession = props.setAuthSession;
    const setApiResPanelState = props.setApiResPanelState;
    const [userId, setUserId] = useState("");
    const [userRole, setUserRole] = useState("");

    async function handleChangeUserRoleClick() {
        const request = prepareApiRequest(setApiResPanelState, {
            method: "PATCH",
            url: "http://localhost:8081/admin/users/"+ userId +"/role",
            headers: {
                "Authorization": "Bearer " + authSession.token,
                "Content-Type": "application/json"
            },
            body: {
                userRole: userRole
            }
        });

        if(guardNotAdmin(setApiResPanelState, authSession)) { return; }
        if(guardEmptyInputs(setApiResPanelState, userId, userRole)) { return; }
        if(guardInputNotNumber(setApiResPanelState, userId)) { return; }
        const {response} = await sendApiRequest(setApiResPanelState, request);

        if(response.ok && Number(userId) === Number(authSession.userId)) {
            addFrontendMessages(setApiResPanelState,
                "Own Access-lvl was changed",
                "Login again is required"
            );
            setAuthSession({
                token: null,
                userId: null,
                userRole: null
            });
        }
    }

    return (
        <div className="shrink-0 w-fit grid items-center p-5 border-t-3 border-t-yellow-300
                     border-x-2 border-b-2 border-x-[#263449] border-b-[#263449] rounded-xl">

            <div className="flex justify-between font-bold">
                <span className="bg-yellow-950 text-xs text-yellow-400
                    border-2 border-yellow-400 rounded-full px-3 py-1">PATCH</span>

                <span className="bg-orange-950 text-xs text-orange-400
                    border-2 border-orange-400 rounded-full px-3 py-1">Admin</span>
            </div>

            <div className="mt-5"> {/* Card Header */}
                <span className="text-2xl font-bold">Change User Role</span>
                <p className="text-slate-500">Give a new Access-level to existing user</p>
            </div>


            <div className="flex gap-5 mt-5">

                <div className="w-60"> {/* Card input user id */}
                    <label htmlFor="change-user-role-userId">User ID</label> <br/>
                    <input id="change-user-role-userId" autoComplete="off" placeholder="Enter user id (only integer number)"
                           value={userId} onChange={(event) => setUserId(event.target.value)}
                           inputMode="numeric" className="placeholder:text-slate-500 focus:outline-0 focus:border-yellow-400
                            border text-sm text-yellow-400 border-orange-400 rounded-lg w-full px-2 py-1 mt-2"/>
                </div>


                <div className="w-25"> {/* Card scroll-down role selection */}
                    <label htmlFor="change-user-role-userRole">User Role</label> <br/>

                    <select id="change-user-role-userRole"  autoComplete="off"
                            value={userRole} onChange={(event) => setUserRole(event.target.value)}
                            className="bg-[#111827] focus:outline-0 focus:border-yellow-400 focus:text-yellow-400
                            border text-sm text-orange-400 border-orange-400 rounded-lg px-2 w-full py-1 mt-2">

                        <option className="text-yellow-400 border-yellow-400" value="" disabled>Select role</option>
                        <option className="text-yellow-400 border-yellow-400" value="USER">USER</option>
                        <option className="text-yellow-400 border-yellow-400" value="ADMIN">ADMIN</option>
                    </select>
                </div>

            </div>

            <div className="flex mt-6 gap-5">

                <button id="change-user-role-btn" onClick={handleChangeUserRoleClick} className="transition-colors
                    hover:bg-yellow-900 cursor-pointer text-sm font-bold bg-yellow-600 rounded-lg px-5 pb-2 pt-1">Change
                </button>

                <p className="text-sm text-slate-500 pt-1">Change role of the user</p>

            </div>
        </div>
    );
}
import { prepareApiRequest, sendApiRequest } from "../utils/apiRequestHelpers.js";

export default function ShowAllUsersPublicCard(props) {
    const setApiResPanelState = props.setApiResPanelState;

    async function handleShowUsersPublicClick() {
        const request = prepareApiRequest(setApiResPanelState, {
            method: "GET",
            url: "http://localhost:8081/users",
        });

        await sendApiRequest(setApiResPanelState, request);
    }

    return (
        <div className="shrink-0 w-fit grid items-center p-5 border-t-3 border-t-emerald-500
                     border-x-2 border-b-2 border-x-[#263449] border-b-[#263449] rounded-xl">
            
            <div className="flex justify-between font-bold">
                <span className="bg-emerald-950 text-xs text-emerald-400
                    border-2 border-emerald-400 rounded-full px-3 py-1">GET</span>

                <span className="bg-teal-950 text-xs text-teal-400
                    border-2 border-teal-400 rounded-full px-3 py-1">Public</span>
            </div>

            <div className="mt-5"> {/* Card Header */}
                <span className="text-2xl font-bold">Show All Users</span>
                <p className="text-slate-500">Public endpoint for testing</p>
            </div>

            <div className="mt-5"> {/* Card info area */}
                <span className="hover:text-emerald-400 hover:border-emerald-400
                         border text-sm text-teal-400 border-teal-400 rounded-lg pl-2 pr-25 py-1">User list preview</span>
            </div>

            <div className="flex mt-6 gap-5">

                <button id="show-all-users-public-btn" onClick={handleShowUsersPublicClick} className="transition-colors
                    hover:bg-emerald-900 cursor-pointer text-sm font-bold bg-emerald-600 rounded-lg px-5 pb-2 pt-1">Show
                </button>

                <p className="text-sm text-slate-500 pt-1">Returns public user profiles in database</p>

            </div>
        </div>
    );
}
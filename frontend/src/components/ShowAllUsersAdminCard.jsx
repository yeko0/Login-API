
export default function ShowAllUsersAdminCard(props) {
    const authSession = props.authSession;
    const setApiResPanelState = props.setApiResPanelState;

    async function handleShowUsersAdminClick() {
        const startTime = performance.now();

        const response = await fetch("http://localhost:8081/admin/users", {
            method: "GET",
            headers: {
                "Authorization": "Bearer "+ authSession.token
            }
        });

        const responseBody = await response.json();
        const endTime = performance.now();

        setApiResPanelState((prevState) => ({
            ...prevState,

            request: {
                ...prevState.request,
                method: "GET",
                url: "http://localhost:8081/admin/users",
                headers: {
                    "Authorization": "Bearer "+ authSession.token
                },
                body: "Empty"
            },

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
        }))

    }

    return (
        <div className="shrink-0 w-fit grid items-center p-5 border-t-3 border-t-emerald-300
                     border-x-2 border-b-2 border-x-[#263449] border-b-[#263449] rounded-xl">

            <div className="flex justify-between font-bold">
                <span className="bg-emerald-950 text-xs text-emerald-400
                    border-2 border-emerald-400 rounded-full px-3 py-1">GET</span>

                <span className="bg-orange-950 text-xs text-orange-400
                    border-2 border-orange-400 rounded-full px-3 py-1">Admin</span>
            </div>

            <div className="mt-5"> {/* Card Header */}
                <span className="text-2xl font-bold">Show All Users</span>
                <p className="text-slate-500">Requires admin access level</p>
            </div>

            <div className="mt-5"> {/* Card info area */}
                <span className="hover:text-emerald-400 hover:border-emerald-400
                         border text-sm text-orange-400 border-orange-400 rounded-lg pl-2 pr-25 py-1">Admin users review</span>
            </div>

            <div className="flex mt-6 gap-5">

                <button id="show-users-admin-btn" onClick={handleShowUsersAdminClick} className="transition-colors
                    hover:bg-emerald-900 cursor-pointer text-sm font-bold bg-emerald-600 rounded-lg px-5 pb-2 pt-1">Show
                </button>

                <p className="text-sm text-slate-500 pt-1">Returns public user profiles in database</p>

            </div>
        </div>
    );
}
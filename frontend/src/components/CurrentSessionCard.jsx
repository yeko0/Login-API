
export default function CurrentSessionCard(props) {
    const authSession = props.authSession;
    const setApiResPanelState = props.setApiResPanelState;

    async function handleCurrentSessionClick() {
        if (!authSession.token) {
            setApiResPanelState((prevState) => ({
                ...prevState,

                request: {
                    ...prevState.request,
                    method: "GET",
                    url: "http://localhost:8081/auth/session",
                    headers: "Authorization token missing",
                    body: "Empty"
                },

                response: {
                    ...prevState.response,
                    raw: null,
                    status: 401,
                    headers: "Empty",
                    body: {
                        backendMessage: "Login to get current session"
                    }
                },

                fetchSpeed: {
                    startTime: 0,
                    endTime: 0,
                    responseTime: null
                },

                selectedButton: "body"
            }));

            return;
        }

        const startTime = performance.now();

        const response = await fetch("http://localhost:8081/auth/session", {
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
                url: "http://localhost:8081/auth/session",
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
        }));
    }

    return (
        <div className="shrink-0 w-fit grid items-center p-5 border-t-3 border-t-emerald-500
                    border-x-2 border-b-2 border-x-[#263449] border-b-[#263449] rounded-xl">

            <div className="flex justify-between font-bold">
                <span className="bg-emerald-950 text-xs text-emerald-400
                        border-2 border-emerald-400 rounded-full px-3 py-1">GET</span>

                <span className="bg-violet-950 text-xs text-violet-400
                        border-2 border-violet-400 rounded-full px-3 py-1">Token</span>
            </div>

            <div className="mt-5"> {/* Card Header */}
                <span className="text-2xl font-bold">Current Session</span>
                <p className="text-slate-500">Validate current token and show active user</p>
            </div>

            <div className="mt-5"> {/* Card info area */}
                <span className="hover:text-emerald-400 hover:border-emerald-400
                         border text-sm text-violet-400 border-violet-400 rounded-lg pl-2 pr-25 py-1">Token status</span>
            </div>

            <div className="flex mt-6 gap-5">

                <button id="current-session-btn" onClick={handleCurrentSessionClick}
                        className="transition-colors hover:bg-emerald-900 cursor-pointer text-sm font-bold
                                bg-emerald-600 rounded-lg px-5 pb-2 pt-1">Check
                </button>

                <p className="text-sm text-slate-500 pt-1">Returns logged-in user from current token</p>

            </div>
        </div>
    );
}
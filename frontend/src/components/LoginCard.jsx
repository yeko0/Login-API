
export default function LoginCard(props){
    const setApiResPanelState = props.setApiResPanelState;

    function handleLoginClick() {
        setApiResPanelState((prevState) => ({
            ...prevState,

            request: {
                ...prevState.request,
                method: "POST",
                url: "http://localhost:8081/auth/login",
                headers: "Content-Type: application/json",
                body: {
                    userName: "fakeUser",
                    userPin: "1234"
                }
            },

            response: {
                ...prevState.response,
                status: 200,
                headers: "Fake headers from React",
                body: {
                    backendMessage: "Fake login response from React",
                    token: "fake-token-123",
                    userRole: "ADMIN"
                }
            },

            fetchSpeed: {
                startTime: 0,
                endTime: 0,
                responseTime: 25
            },

            selectedView: "body"
        }));
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


            <div> {/* Header */}
                <span className="text-2xl font-bold">Login</span>
                <p className="text-slate-500">Authenticate a user and receive JWT</p>
            </div>


            <div className="mt-5 w-70"> {/* input userName */}
                <label htmlFor="login-userName">User name</label> <br/>
                <input id="login-userName" autoComplete="off" placeholder="Enter user name"
                       className="placeholder:text-slate-500 focus:outline-0 focus:border-cyan-400
                         border text-sm text-cyan-400 border-teal-400 rounded-lg pl-2 w-full py-1 mt-2"/>
            </div>


            <div className="mt-5 w-70"> {/* input user pin */}
                <label htmlFor="login-userPin">User Pin</label> <br/>
                <input id="login-userPin" type="password" autoComplete="off" placeholder="Enter user pin"
                       className="placeholder:text-slate-500 focus:outline-0 focus:border-cyan-400
                         border text-sm text-cyan-400 border-teal-400 rounded-lg pl-2 w-full py-1 mt-2"/>
            </div>



            <div className="flex mt-6 gap-5">
                <button onClick={handleLoginClick} id="login-btn" className="transition-colors hover:bg-cyan-900
                            cursor-pointer text-sm font-bold bg-cyan-600 rounded-lg px-5 pb-1.5 pt-1">Login
                </button>
                <p className="text-sm text-slate-500 pt-1">Returns JWT token if authenticated</p>
            </div>
        </div>
    );
}
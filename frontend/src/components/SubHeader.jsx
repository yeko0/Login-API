const statusStyles = {
    0:   { text: "fetch-fail",   classes: "text-red-400 border-red-400" },
    200: { text: "OK",           classes: "text-green-400 border-green-400" },
    201: { text: "Created",      classes: "text-green-400 border-green-400" },
    204: { text: "No Content",   classes: "text-green-400 border-green-400" },
    400: { text: "Bad Request",  classes: "text-yellow-400 border-yellow-400" },
    401: { text: "Unauthorized", classes: "text-orange-400 border-orange-400" },
    403: { text: "Forbidden",    classes: "text-red-400 border-red-400" },
    404: { text: "Not Found",    classes: "text-slate-400 border-slate-400" },
    409: { text: "Invalid data", classes: "text-yellow-400 border-yellow-400" },
    500: { text: "Server Error", classes: "text-red-400 border-red-400" }
};

export default function SubHeader(props) {
    const authSession = props.authSession;
    const apiResPanelState = props.apiResPanelState;

    const status = apiResPanelState.response.status;
    const statusStyle = statusStyles[status] ?? {
        text: "?-Status",
        classes: "text-cyan-400 border-cyan-400"
    };

    const tokenText = status === null
        ? "loading..."
        : authSession.token
            ? "valid"
            : "Login to get";

    const tokenStyle = status === null
        ? "text-cyan-300"
        : authSession.token
            ? "text-green-400"
            : statusStyle.classes;

    return (
        <div className="relative flex items-center justify-between text-sm text-slate-500 border border-[#263449] rounded-xl p-2">

            {/* Start Div=2 Left Group */}
            <div className="flex items-center gap-5">

                <p>Endpoints groups</p>


                {/* Start Div=3 Tags-Endpoints group */}
                <div className="flex gap-5 font-bold ">
                    <span className="bg-teal-950 text-xs text-teal-400 border-2 border-teal-400 rounded-full px-3 py-1">Public</span>
                    <span className="bg-sky-950 text-xs text-sky-400 border-2 border-sky-400 rounded-full px-3 py-1">Owner</span>
                    <span className="bg-orange-950 text-xs text-orange-400 border-2 border-orange-400 rounded-full px-3 py-1">Admin</span>
                    <span className="bg-violet-950 text-xs text-violet-400 border-2 border-violet-400 rounded-full px-3 py-1">Token</span>
                </div>{/* End Div=3 Tags-endpoints group */}


                <span className=" bg-slate-700 h-8 w-px"></span>


                <p>HTTP methods</p>


                {/* Start Div=3 Tags-Endpoints group */}
                <div id="methods-badges" className="flex gap-5 font-bold ">
                    <span className="bg-emerald-950 text-xs text-emerald-400 border-2 border-emerald-400 rounded-full px-3 py-1">GET</span>
                    <span className="bg-cyan-950 text-xs text-cyan-400 border-2 border-cyan-400 rounded-full px-3 py-1">POST</span>
                    <span className="bg-yellow-950 text-xs text-yellow-400 border-2 border-yellow-400 rounded-full px-3 py-1">PATCH</span>
                    <span className="bg-red-950 text-xs text-red-500 border-2 border-red-500 rounded-full px-3 py-1">DELETE</span>
                </div>{/* End Div=3 Tags-endpoints group */}

            </div>{/* End Div=2 Left Group */}



            {/* Start Div=4 right Group */}
            <div className="flex items-center gap-1 text-sm border-2 border-[#263449] rounded-full pt-1 pb-2 px-5">
                <span>Current token:</span>
                <span id="sub-header-token-dot" className={tokenStyle}>●</span>
                <span id="sub-header-token-text" className={tokenStyle}>{tokenText}</span>
                <button id="sub-header-token-btn"
                        className="bg-violet-950 text-xs text-violet-400 border-2 border-violet-400
                         hover:text-violet-600 hover:border-violet-600
                          rounded-full px-2 pb-0.5 mt-0.5 cursor-pointer">Token
                </button>
            </div>{/* End Div=4 right Group */}

        </div>/* End Sub-Header Container */
    );
}
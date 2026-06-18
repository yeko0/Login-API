const badgeClassesStyles = {
    public : "bg-teal-950 text-xs text-teal-400 border-2 border-teal-400 rounded-full px-3 py-1",
    owner : "bg-sky-950 text-xs text-sky-400 border-2 border-sky-400 rounded-full px-3 py-1",
    admin : "bg-orange-950 text-xs text-orange-400 border-2 border-orange-400 rounded-full px-3 py-1",
    token : "bg-violet-950 text-xs text-violet-400 border-2 border-violet-400 rounded-full px-3 py-1",
    GET : "bg-emerald-950 text-xs text-emerald-400 border-2 border-emerald-400 rounded-full px-3 py-1",
    POST : "bg-cyan-950 text-xs text-cyan-400 border-2 border-cyan-400 rounded-full px-3 py-1",
    PATCH : "bg-yellow-950 text-xs text-yellow-400 border-2 border-yellow-400 rounded-full px-3 py-1",
    DELETE : "bg-red-950 text-xs text-red-500 border-2 border-red-500 rounded-full px-3 py-1",
    LOADING : "bg-cyan-950 text-xs text-cyan-300 border-2 border-cyan-300 rounded-full px-3 py-1",
};

export default function ResponsePanel(props) {
    const apiResPanelState = props.apiResPanelState;
    const methodBadgeClass = badgeClassesStyles[apiResPanelState.request.method] ?? badgeClassesStyles.LOADING;
    const setApiResPanelState = props.setApiResPanelState;
    let panelContent = apiResPanelState.response.body;

    if (apiResPanelState.selectedButton === "headers") {
        panelContent = {
            request: apiResPanelState.request.headers,
            response: apiResPanelState.response.headers
        };
    }

    if (apiResPanelState.selectedButton === "payload") {
        panelContent = apiResPanelState.request.body;
    }

    const panelText = stringifyPanelContent(panelContent);

    function stringifyPanelContent(content) {
        if (typeof content === "string") {
            return content;
        }

        return JSON.stringify(content, null, 2);
    }

    function handleSelectedView(button) {
        setApiResPanelState((prevState) => ({
            ...prevState,
            selectedButton: button
        }));
    }

    function paintSelectedButton(button) {
        return apiResPanelState.selectedButton === button
            ? "border-cyan-300 text-cyan-300"
            : "border-[#263449] text-slate-500";
    }

    return (
        <div className="shrink-0 flex flex-col p-4 w-120 h-[calc(90vh-180px)]
            border-2 border-x-[#263449] border-b-[#263449] border-t-cyan-300 rounded-xl">


            {/* Api response Header */}
            <h1 className="text-3xl font-bold">API Response</h1>
            <h3 className="text-slate-500">Live feedback from the selected endpoint</h3>


            {/* Api response box for method and url */}
            <div className="flex items-center gap-5 border-2 border-[#263449] rounded-lg mt-4 p-3">
                <span id="api-response-method-badge" className={methodBadgeClass}>
                    {apiResPanelState.request.method ?? "Loading..."}
                </span>

                <p id="api-response-url" className="text-base text-cyan-400">
                    {apiResPanelState.request.url}
                </p>
            </div>


            {/* START Api response info tags */}
            <div className="flex justify-evenly items-center gap-3 mt-4 text-slate-500
                    *:flex-1 *:border-2 *:border-[#263449] *:rounded-lg *:text-xs *:pl-2 *:py-1">
                <div>
                    <h5>Status</h5>
                    <span id="api-response-info-tag-status" className="text-cyan-300">
                              {apiResPanelState.response.status ?? "Loading..."}</span>
                </div>

                <div>
                    <h5>Time</h5>
                    <span id="api-response-info-tag-time" className="text-cyan-300">
                              {apiResPanelState.fetchSpeed.responseTime !== null
                                  ? `${apiResPanelState.fetchSpeed.responseTime} ms`
                                  : "Loading..."}
                    </span>
                </div>

                <div>
                    <h5>Access-level</h5>
                    <span id="api-response-info-tag-access-level" className="text-cyan-300">
                        Loading...
                    </span>
                </div>
            </div>
            {/* END Api response info tags */}


            {/* START Api response panel-control-pill with buttons */}
            <div
                className="flex *:flex items-center justify-between border-2 border-[#263449] rounded-lg mt-4 p-2 text-xs text-slate-500">

                {/* Left group */}
                <div className="gap-3 *:border-2 *:rounded-full *:px-3 *:pt-1 *:pb-1.5
                               *:cursor-pointer *:hover:text-cyan-300 *:hover:border-cyan-300">
                    <button id="api-response-body-btn" className={paintSelectedButton('body')}
                            onClick={() => handleSelectedView("body")} >Body
                    </button>

                    <button id="api-response-headers-btn" className={paintSelectedButton('headers')}
                            onClick={() => handleSelectedView("headers")} >Headers
                    </button>

                    <button id="api-response-payload-btn" className={paintSelectedButton('payload')}
                            onClick={() => handleSelectedView("payload")}>Payload
                    </button>
                </div>

                {/* right group */}
                <div className="gap-3 *:border-2 *:rounded-full *:px-3 *:pt-1 *:pb-1.5
                               *:cursor-pointer *:hover:text-cyan-300 *:hover:border-cyan-300">
                    <button id="api-response-copy-btn" className="border-[#263449] text-slate-500">Copy</button>
                    <button id="api-response-clear-btn" className="border-[#263449] text-slate-500">Clear</button>
                </div>
            </div>
            {/* END Api response panel-control-pill with buttons */}


            <div className="flex-1 overflow-auto custom-scrollbar border-2 border-[#263449] rounded-lg
                                    mt-4 p-2 text-xs text-slate-500">

                <pre id="api-response-show-text-area" className="text-base">
                    {panelText}
                </pre>
            </div>


        </div>
    );
}
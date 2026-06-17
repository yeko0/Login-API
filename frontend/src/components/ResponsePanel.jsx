
export default function ResponsePanel() {
    return (
        <div className="shrink-0 flex flex-col p-4 w-120 h-[calc(90vh-180px)]
            border-2 border-x-[#263449] border-b-[#263449] border-t-cyan-300 rounded-xl">


            {/* Api response Header */}
            <h1 className="text-3xl font-bold">API Response</h1>
            <h3 className="text-slate-500">Live feedback from the selected endpoint</h3>


            {/* Api response box for method and url */}
            <div className="flex items-center gap-5 border-2 border-[#263449] rounded-lg mt-4 p-3">
              <span id="api-response-method-badge"
                    className="bg-cyan-950 text-xs text-cyan-300 border-2 border-cyan-300 rounded-full px-3 pt-1 pb-1.5">Loading...</span>

                <p id="api-response-url" className="text-base text-cyan-400">http://localhost:8081/...</p>
            </div>


            {/* START Api response info tags */}
            <div className="flex justify-evenly items-center gap-3 mt-4 text-slate-500
                    *:flex-1 *:border-2 *:border-[#263449] *:rounded-lg *:text-xs *:pl-2 *:py-1">
                <div>
                    <h5>Status</h5>
                    <span id="api-response-info-tag-status" className="text-cyan-300">
                              Loading...</span>
                </div>

                <div>
                    <h5>Time</h5>
                    <span id="api-response-info-tag-time" className="text-cyan-300">
                              Loading...</span>
                </div>

                <div>
                    <h5>Access-level</h5>
                    <span id="api-response-info-tag-access-level" className="text-cyan-300">
                              Loading...</span>
                </div>
            </div>
            {/* END Api response info tags */}


            {/* START Api response panel-control-pill with buttons */}
            <div
                className="flex *:flex items-center justify-between border-2 border-[#263449] rounded-lg mt-4 p-2 text-xs text-slate-500">

                {/* Left group */}
                <div className="gap-3 *:border-2 *:rounded-full *:px-3 *:pt-1 *:pb-1.5
                               *:cursor-pointer *:hover:text-cyan-300 *:hover:border-cyan-300">
                    <button id="api-response-body-btn" className="border-[#263449] text-slate-500">Body</button>
                    <button id="api-response-headers-btn" className="border-[#263449] text-slate-500">Headers</button>
                    <button id="api-response-payload-btn" className="border-[#263449] text-slate-500">Payload</button>
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
{`Example response:
[
  {
    "userId": 10,
    "userName": "yeko33",
    "userRole": "USER"
  },
  {
    "userId": 9,
    "userName": "yeko45",
    "userRole": "USER"
  }
]`}
              </pre>
            </div>


        </div>
    );
}
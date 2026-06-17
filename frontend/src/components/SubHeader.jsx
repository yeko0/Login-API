
export default function SubHeader() {
    return (
        <div className="relative flex items-center justify-between text-sm text-slate-500 border border-[#263449] rounded-xl p-2 mt-2">

            {/* Start Div=2 Left Group */}
            <div className="flex items-center gap-5">

                <p>Endpoint groups</p>


                {/* Start Div=3 Tags-Endpoints group */}
                <div className="ml-5 font-bold ">
                    <span className="bg-teal-950 text-xs text-teal-400 border-2 border-teal-400 rounded-full px-3 py-0.5 mr-5">Public</span>
                    <span className="bg-sky-950 text-xs text-sky-400 border-2 border-sky-400 rounded-full px-3 py-0.5 mr-5">Owner</span>
                    <span className="bg-orange-950 text-xs text-orange-400 border-2 border-orange-400 rounded-full px-3 py-0.5 mr-5">Admin</span>
                    <span className="bg-violet-950 text-xs text-violet-400 border-2 border-violet-400 rounded-full px-3 py-0.5 mr-5">Token</span>
                </div>{/* End Div=3 Tags-endpoints group */}


                <span className=" bg-slate-700 h-8 w-px"></span>


                <p>HTTP methods</p>


                {/* Start Div=3 Tags-Endpoints group */}
                <div id="methods-badges" className="ml-5 font-bold ">
                    <span className="bg-emerald-950 text-xs text-emerald-400 border-2 border-emerald-400 rounded-full px-3 py-0.5 mr-5">GET</span>
                    <span className="bg-cyan-950 text-xs text-cyan-400 border-2 border-cyan-400 rounded-full px-3 py-0.5 mr-5">POST</span>
                    <span className="bg-yellow-950 text-xs text-yellow-400 border-2 border-yellow-400 rounded-full px-3 py-0.5 mr-5">PATCH</span>
                    <span className="bg-red-950 text-xs text-red-500 border-2 border-red-500 rounded-full px-3 py-0.5 mr-5">DELETE</span>
                </div>{/* End Div=3 Tags-endpoints group */}

            </div>{/* End Div=2 Left Group */}



            {/* Start Div=4 right Group */}
            <div className="flex items-center gap-1 text-sm border-2 border-[#263449] rounded-full pt-1 pb-2 px-5">
                <span>Current token:</span>
                <span id="sub-header-token-dot" className="text-cyan-300">●</span>
                <span id="sub-header-token-text" className="text-cyan-300">loading...</span>
                <button id="sub-header-token-btn"
                        className="bg-violet-950 text-xs text-violet-400 border-2 border-violet-400
                         hover:text-violet-600 hover:border-violet-600
                          rounded-full px-2 pb-0.5 mt-0.5 cursor-pointer">Token
                </button>
            </div>{/* End Div=4 right Group */}

        </div>/* End Sub-Header Container */
    );
}
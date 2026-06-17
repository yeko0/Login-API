
export default function ChangePinCard() {
    return(
        <div className="shrink-0 w-fit grid items-center p-4 border-t-3 border-t-yellow-300
                            border-x-2 border-b-2 border-x-[#263449] border-b-[#263449] rounded-xl">

            <div className="flex justify-between mb-5 font-bold">
                <span className="bg-yellow-950 text-xs text-yellow-400
                border-2 border-yellow-400 rounded-full px-3 py-0.5">PATCH</span>

                <span className="bg-sky-950 text-xs text-sky-400
                border-2 border-sky-400 rounded-full px-3 py-0.5">Owner</span>
            </div>

            <div> {/* Card Header */}
                <span className="text-2xl font-bold">Change Pin</span>
                <p className="text-slate-500">Requires valid token & access level</p>
            </div>

            <div className="mt-5 w-70"> {/* Card input userName */}
                <label htmlFor="change-pin-userName">Confirm User name</label> <br/>
                <input id="change-pin-userName" autoComplete="off" placeholder="Enter user name"
                       className="placeholder:text-slate-500 focus:outline-0 focus:border-yellow-400
                         border text-sm text-yellow-400 border-sky-400 rounded-lg pl-2 w-full pr-2 py-1 mt-2"/>
            </div>

            <div className="mt-5 w-70"> {/* Card input user pin */}
                <label htmlFor="change-pin-userPin">Confirm User Pin</label> <br/>
                <input id="change-pin-userPin" type="password" autoComplete="off" placeholder="Enter current pin"
                       className="placeholder:text-slate-500 focus:outline-0 focus:border-yellow-400
                         border text-sm text-yellow-400 border-sky-400 rounded-lg pl-2 w-full pr-2 py-1 mt-2"/>
            </div>

            <div className="flex mt-5 gap-5">
                <div> {/* Card input user pin */}
                    <label htmlFor="change-pin-newUserPin">New User Pin</label> <br/>
                    <input id="change-pin-newUserPin" type="password" autoComplete="off" placeholder="Enter new pin"
                           className="placeholder:text-slate-500 focus:outline-0 focus:border-yellow-400
                         border text-sm text-yellow-400 border-sky-400 rounded-lg pl-2 w-full pr-5 py-1 mt-2"/>
                </div>

                <div className="mt-7.5">
                    <button id="change-pin-btn" className="transition-colors hover:bg-yellow-900 cursor-pointer
                                 text-sm font-bold bg-yellow-600 rounded-lg px-5 pb-2 pt-1">Change
                    </button>
                </div>
            </div>
        </div>
    );
}
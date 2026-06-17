
export default function SearchUserByIdCard() {
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
                <span className="text-2xl font-bold">Search Users by ID</span>
                <p className="text-slate-500">Requires admin access level</p>
            </div>

            <div className="mt-5 w-70"> {/* Card input userId */}
                <label htmlFor="search-user-by-id-userId">User ID</label> <br/>
                <input id="search-user-by-id-userId" autoComplete="off" placeholder="Enter user id (only integer number)"
                       inputMode="numeric" className="placeholder:text-slate-500 focus:outline-0 focus:border-emerald-400
                         border text-sm text-emerald-400 border-orange-400 rounded-lg pl-2 w-full pr-2 py-1 mt-2"/>
            </div>

            <div className="flex mt-6 gap-5">

                <button id="search-user-by-id-btn" className="transition-colors hover:bg-emerald-900 cursor-pointer
                                 text-sm font-bold bg-emerald-600 rounded-lg px-5 pb-2 pt-1">Search
                </button>

                <p className="text-sm text-slate-500 pt-1">Returns public user profile in database</p>

            </div>
        </div>
    );
}

export default function DeleteUserCard() {
    return (
        <div className="shrink-0 w-fit grid items-center p-5 border-t-3 border-t-red-600
                border-x-2 border-b-2 border-x-[#263449] border-b-[#263449] rounded-xl">

            <div className="flex justify-between font-bold">
                <span className="bg-red-950 text-xs text-red-500
                    border-2 border-red-500 rounded-full px-3 py-1">DELETE</span>

                <span className="bg-sky-950 text-xs text-sky-400
                    border-2 border-sky-400 rounded-full px-3 py-1">Owner</span>
            </div>


            <div className="mt-5"> {/* Card Header */}
                <span className="text-2xl font-bold">Delete User</span>
                <p className="text-slate-500">Requires own-account credentials</p>
            </div>



            <div className="mt-5 w-70"> {/* Card input user id */}
                <label htmlFor="delete-user-by-id-userId">Confirm Own-User ID</label> <br/>
                <input id="delete-user-by-id-userId" inputMode="numeric" autoComplete="off" placeholder="Enter user id"
                       className="placeholder:text-slate-500 focus:outline-0 focus:border-red-500
                            border text-sm text-red-500 border-sky-400 rounded-lg w-full px-2 py-1 mt-2"/>
            </div>



            <div className="mt-5 w-70"> {/* Card input user name */}
                <label htmlFor="delete-user-by-id-userName">Confirm Own-User name</label> <br/>
                <input id="delete-user-by-id-userName" autoComplete="off" placeholder="Enter user name"
                       className="placeholder:text-slate-500 focus:outline-0 focus:border-red-500
                            border text-sm text-red-500 border-sky-400 rounded-lg w-full px-2 py-1 mt-2"/>
            </div>



            <div className="mt-5 w-70"> {/* Card input user pin */}
                <label htmlFor="delete-user-by-id-userPin">Confirm Own-User Pin</label> <br/>
                <input id="delete-user-by-id-userPin" autoComplete="off" type="password"
                       placeholder="Enter user pin" className="placeholder:text-slate-500 focus:outline-0 focus:border-red-500
                            border text-sm text-red-500 border-sky-400 rounded-lg w-full px-2 py-1 mt-2"/>
            </div>



            <div className="flex mt-6 gap-5">

                <button id="delete-user-btn" className="transition-colors hover:bg-red-900 cursor-pointer
                                 text-sm font-bold bg-red-600 rounded-lg px-5 pb-2 pt-1">Delete
                </button>

                <p className="text-sm text-slate-500 pt-1">Removes user account from the database</p>

            </div>
        </div>
    );
}
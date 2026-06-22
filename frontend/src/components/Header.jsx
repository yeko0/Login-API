
export default function Header(props) {
    const backendStatus = props.backendStatus;

    return (
        <div className="relative border-2 border-[#263449] rounded-2xl p-6">

            {/* Div=2. Header content row */}
            <div className="flex items-center justify-between gap-4">

                {/* Div=2. Left-side Group */}
                <div className="flex items-center justify-between gap-4">

                    {/* Div=2.1 Icon box */}
                    <div className="grid place-items-center rounded-2xl border-2 border-[#263449] h-14 w-14
                                    font-mono font-bold text-cyan-400 text-3xl leading-none">
                        <span className="-translate-y-0.5">&gt;_</span> {/* &gt; is for simbol '>' */}
                    </div>{/* End Div=2.1 */}

                    <div>
                        {/* Div=2.2 Title group */}
                        <h1 className="text-3xl font-bold text-cyan-400">Auth API Console</h1>
                        <p className="text-sm text-slate-400">Frontend REST API v2.5</p>
                    </div>{/* End Div=2.2 */}

                </div>{/* End Div=2 Left-side Group */}

                {/* Div=2 Right-side Group */}
                <div className="flex items-center justify-between gap-20 pr-28">

                    <div className="text-sm text-slate-400">
                        <p>Spring Boot &nbsp;&nbsp; PostgreSQL &nbsp;&nbsp; JWT</p>

                        <div
                            id="backend-status"
                            className="flex items-center justify-center gap-2 mt-2 rounded-full border-2 border-[#263449] px-2 pt-1 pb-2"
                        >
                            <span id="backend-status-dot" className={backendStatus.dotClass}>●</span>
                            <span id="backend-status-text">{backendStatus.text}</span>
                        </div>
                    </div>

                </div>{/* End Div=2 Right-side Group */}

                <div className="absolute right-0 bottom-0 mr-1.5">
                    <p className="text-cyan-400">Dev. Yeko</p>
                </div>

            </div>{/* End Div=2 Header content row */}

        </div>/* End Div=1 Header Container */
    );
}
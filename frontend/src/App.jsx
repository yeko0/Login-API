import {useState, useEffect} from "react";
import Header from "./components/Header.jsx";
import SubHeader from "./components/SubHeader.jsx";
import MainLayout from "./components/MainLayout.jsx";

export default function App() {
    const [backendStatus, setBackendStatus] = useState({
        text: "localhost:8081 checking...",
        dotClass: "text-yellow-400"
    });

    const [authSession, setAuthSession] = useState({
        token: null,
        userId: null,
        userRole: null
    });

    const [apiResPanelState, setApiResPanelState] = useState({
        request: {
            method: null,
            url: "http://localhost:8081/...",
            headers: "Empty",
            body: "Empty",
        },

        response: {
            raw: null,
            status: null,
            headers: "Empty",
            body: {
                backendMessage: ["Empty"]
            }
        },

        fetchSpeed: {
            startTime: 0,
            endTime: 0,
            responseTime: null
        },

        selectedButton: "body"
    });

    useEffect(() => {
        async function checkBackendStatus() {
            try {
                const response = await fetch("http://localhost:8081/users");

                if (response.ok) {
                    setBackendStatus({
                        text: "localhost:8081 online",
                        dotClass: "text-green-400"
                    });
                } else {
                    setBackendStatus({
                        text: "localhost:8081 error",
                        dotClass: "text-red-400"
                    });
                }
            } catch (error) {
                setBackendStatus({
                    text: "localhost:8081 offline",
                    dotClass: "text-red-400"
                });
            }
        }

        const backendCheckTimeout = setTimeout(() => {
            checkBackendStatus();
        }, 1000);

        const backendCheckInterval = setInterval(checkBackendStatus, 5000);

        return () => {
            clearTimeout(backendCheckTimeout);
            clearInterval(backendCheckInterval);
        };

    }, []);


    return (
        <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center bg-no-repeat bg-fixed
                       text-white font-sans flex flex-col gap-5 p-4">
            <Header
                backendStatus ={backendStatus}
            />

            <SubHeader
                authSession={authSession}
                apiResPanelState={apiResPanelState}
            />

            <main>

                <MainLayout
                    apiResPanelState={apiResPanelState}
                    setApiResPanelState={setApiResPanelState}
                    authSession={authSession}
                    setAuthSession={setAuthSession}
                />

            </main>
        </div>
    );
}
import {useState} from "react";
import Header from "./components/Header.jsx";
import SubHeader from "./components/SubHeader.jsx";
import MainLayout from "./components/MainLayout.jsx";

export default function App() {
    const [apiResPanelState, setApiResPanelState] = useState({
        request: {
            method: "GET",
            url: "http://localhost:8081/...",
            headers: "Empty",
            body: "Empty",
            bodyResponse: "Empty"
        },

        response: {
            raw: null,
            status: null,
            headers: "Empty",
            body: {
                backendMessage: "Empty"
            }
        },

        session: {
            userId: null,
            userName: null,
            userRole: null
        },

        fetchSpeed: {
            startTime: 0,
            endTime: 0,
            responseTime: null
        },

        selectedView: "body"
    });

    return (
        <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center bg-no-repeat bg-fixed
                       text-white font-sans flex flex-col gap-5 p-4">
            <Header />
            <SubHeader />

            <main>
                <MainLayout apiResPanelState={apiResPanelState} />
            </main>
        </div>
    );
}
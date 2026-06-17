import Header from "./components/Header.jsx";
import SubHeader from "./components/SubHeader.jsx";
import MainLayout from "./components/MainLayout.jsx";

export default function App() {
    return (
        <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center bg-no-repeat bg-fixed
                       text-white font-sans flex flex-col gap-5 p-4">
            <Header />
            <SubHeader />

            <main>
                <MainLayout />
            </main>
        </div>
    );
}
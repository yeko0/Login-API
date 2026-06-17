import LoginCard from "./LoginCard.jsx";
import RegisterCard from "./RegisterCard.jsx";

export default function MainLayout() {
    return(
        <div className="flex items-start my-2 gap-2">

            {/* Div= Start cards group */}
            <div className="flex flex-1 flex-wrap items-start gap-2">

                <LoginCard />
                <RegisterCard />

            </div>{/* Div= End cards group */}



            {/* Start Control Panel right side */}
            <div className="flex flex-col sticky top-4">


            </div>{/* End Control Panel right side */}


            {/* End Main layout */}
        </div>
    );
}
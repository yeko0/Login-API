import LoginCard from "./LoginCard.jsx";
import RegisterCard from "./RegisterCard.jsx";
import ChangePinCard from "./ChangePinCard.jsx";
import ShowAllUsersAdminCard from "./ShowAllUsersAdminCard.jsx";

export default function MainLayout() {
    return(
        <div className="flex items-start my-2 gap-4">

            {/* Div= Start cards group */}
            <div className="flex flex-1 flex-wrap items-start gap-4">

                <LoginCard />
                <RegisterCard />
                <ChangePinCard />
                <ShowAllUsersAdminCard />

            </div>{/* Div= End cards group */}



            {/* Start Control Panel right side */}
            <div className="flex flex-col sticky top-4">


            </div>{/* End Control Panel right side */}


            {/* End Main layout */}
        </div>
    );
}
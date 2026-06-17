import LoginCard from "./LoginCard.jsx";
import RegisterCard from "./RegisterCard.jsx";
import ChangePinCard from "./ChangePinCard.jsx";
import ShowAllUsersAdminCard from "./ShowAllUsersAdminCard.jsx";
import SearchUserByIdCard from "./SearchUserByIdCard.jsx";
import ChangeUserRoleCard from "./ChangeUserRoleCard.jsx";
import DeleteUserCard from "./DeleteUserCard.jsx";
import CurrentSessionCard from "./CurrentSessionCard.jsx";
import ShowAllUsersPublicCard from "./ShowAllUsersPublicCard.jsx";
import ResponsePanel from "./ResponsePanel.jsx"

export default function MainLayout() {
    return(
        <div className="flex items-start my-2 gap-4">

            {/* Div= Start cards group */}
            <div className="flex flex-1 flex-wrap items-start gap-4">

                <LoginCard />
                <RegisterCard />
                <ChangePinCard />
                <ShowAllUsersAdminCard />
                <SearchUserByIdCard />
                <ChangeUserRoleCard />
                <DeleteUserCard />
                <CurrentSessionCard />
                <ShowAllUsersPublicCard />

            </div>{/* Div= End cards group */}



            {/* Start Control Panel right side */}
            <div className="flex flex-col sticky top-4">

                <ResponsePanel />

            </div>{/* End Control Panel right side */}


            {/* End Main layout */}
        </div>
    );
}
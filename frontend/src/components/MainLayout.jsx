import LoginCard from "./LoginCard.jsx";
import RegisterUserCard from "./RegisterUserCard.jsx";
import ChangePinCard from "./ChangePinCard.jsx";
import ShowAllUsersAdminCard from "./ShowAllUsersAdminCard.jsx";
import SearchUserByIdCard from "./SearchUserByIdCard.jsx";
import ChangeUserRoleCard from "./ChangeUserRoleCard.jsx";
import DeleteUserCard from "./DeleteUserCard.jsx";
import CurrentSessionCard from "./CurrentSessionCard.jsx";
import ShowAllUsersPublicCard from "./ShowAllUsersPublicCard.jsx";
import ResponsePanel from "./ResponsePanel.jsx"

export default function MainLayout(props) {
    const apiResPanelState = props.apiResPanelState;
    const setApiResPanelState = props.setApiResPanelState;
    const authSession = props.authSession;
    const setAuthSession = props.setAuthSession;

    return(
        <div className="flex items-start gap-4">

            {/* Div= Start cards group */}
            <div className="flex flex-1 flex-wrap items-start gap-4">

                <LoginCard
                    setApiResPanelState={setApiResPanelState}
                    setAuthSession={setAuthSession}
                />

                <RegisterUserCard
                    setApiResPanelState={setApiResPanelState}
                />

                <ShowAllUsersAdminCard
                    setApiResPanelState={setApiResPanelState}
                    authSession={authSession}
                />

                <ShowAllUsersPublicCard
                    setApiResPanelState={setApiResPanelState}
                />

                <ChangePinCard
                    setApiResPanelState={setApiResPanelState}
                    authSession={authSession}
                    setAuthSession={setAuthSession}
                />

                <SearchUserByIdCard
                    setApiResPanelState={setApiResPanelState}
                    authSession={authSession}
                />

                <CurrentSessionCard
                    setApiResPanelState={setApiResPanelState}
                    authSession={authSession}
                />

                <DeleteUserCard
                    setApiResPanelState={setApiResPanelState}
                    authSession={authSession}
                    setAuthSession={setAuthSession}
                />

                <ChangeUserRoleCard
                    setApiResPanelState={setApiResPanelState}
                    authSession={authSession}
                    setAuthSession={setAuthSession}
                />

            </div>{/* Div= End cards group */}



            {/* Start Control Panel right side */}
            <div className="flex flex-col sticky top-4">

                <ResponsePanel
                    apiResPanelState={apiResPanelState}
                    setApiResPanelState={setApiResPanelState}
                    authSession={authSession}
                />

            </div>{/* End Control Panel right side */}


            {/* End Main layout */}
        </div>
    );
}
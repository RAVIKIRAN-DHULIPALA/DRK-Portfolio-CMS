import { memo } from "react"
import MainContainer from "../Components/MainLayout-blue/MainContainer";
const ProfilePage = memo(() => {
    return <MainContainer title={"Profile"}
        isProfile={true}
        containerName="static"
        docName="portfolioLinks"
    />;
})

export default ProfilePage;
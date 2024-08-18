import { memo, useEffect, useState } from "react";
import MainContainer from "../../../Components/MainLayout-blue/MainContainer";
import { getOrderedData } from "../../../Firebase-utils/CallingMethods";

const UXposts = memo(() => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Set up the onQuerySnapshot listener
        const unsubscribe = getOrderedData("UX Posts", setData, "contents", setLoading)
        // Cleanup listener
        return () => unsubscribe();
    }, []);
    return <MainContainer title={"UX posts"} supportingText={"Place to manage, add posts in the portfolio"} buttonText={"posts"}
        type="post"
        containerName="uxposts-thumbnails"
        docName="UX Posts"
        data={data} loading={loading} />;
});

export default UXposts;
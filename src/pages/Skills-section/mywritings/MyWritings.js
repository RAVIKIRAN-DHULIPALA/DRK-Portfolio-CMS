import { memo, useEffect, useState } from "react";
import MainContainer from "../../../Components/MainLayout-blue/MainContainer";
import { getOrderedData } from "../../../Firebase-utils/CallingMethods";

const MyWritings = memo(() => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Set up the onQuerySnapshot listener
        const unsubscribe = getOrderedData("My Writings", setData, "contents", setLoading)
        // Cleanup listener
        return () => unsubscribe();
    }, []);
    return <MainContainer title={"My writings"} supportingText={"Place to manage, add blog posts in the portfolio"} buttonText={"writings"}
        type="writing"
        containerName="uxwritings-thumbnails"
        docName="My Writings"
        data={data} loading={loading} />;
});

export default MyWritings;
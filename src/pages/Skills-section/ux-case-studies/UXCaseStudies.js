import { memo, useEffect, useState } from "react";
import MainContainer from "../../../Components/MainLayout-blue/MainContainer";
import { getOrderedData } from "../../../Firebase-utils/CallingMethods";


const UXCaseStudies = memo(() => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {

        // Set up the onQuerySnapshot listener
        const unsubscribe = getOrderedData("UX case studies", setData, "contents", setLoading);
        // Cleanup listener
        return () => unsubscribe();

    }, []);

    return <MainContainer
        title={"UX case studies"}
        supportingText={"Place to manage, add UX case studies in the portfolio"}
        buttonText={"case studies"}
        type="casestudy"
        containerName="casestudies-thumbnails"
        docName="UX case studies"
        data={data}
        loading={loading}
    />
})

export default UXCaseStudies;
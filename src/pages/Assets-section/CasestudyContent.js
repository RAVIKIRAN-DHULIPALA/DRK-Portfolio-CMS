import { memo, useEffect, useState } from "react";
import MainContainer from "../../Components/MainLayout-blue/MainContainer"
import { getCaseStudyContentFolders } from "../../Firebase-utils/CallingMethods";

const Casestudycontent = memo(() => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {

        // Set up the onQuerySnapshot listener
        const unsubscribe = getCaseStudyContentFolders(setData, setLoading)
        // Cleanup listener
        return () => unsubscribe();
    }, []);

    return <MainContainer
        title={"Case study content"}
        supportingText={"Place to manage case study content in the portfolio"}
        type="folders"
        data={data}
        loading={loading}
    />
})

export default Casestudycontent;
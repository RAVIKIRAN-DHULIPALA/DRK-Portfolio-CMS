import { memo, useEffect, useState } from "react";
import MainContainer from "../../../Components/MainLayout-blue/MainContainer";
import { getDesignsData } from "../../../Firebase-utils/CallingMethods";

const UiDesigns = memo(() => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Set up the onQuerySnapshot listener
        const unsubscribe = getDesignsData("UI Designs-Animations", setData, "contents", setLoading)
        // Cleanup listener
        return () => unsubscribe();
    }, []);
    return <MainContainer title={"UI Designs and Animations"}
        supportingText={"Place to manage, add UI designs in the portfolio"}
        buttonText={"designs"}
        type="designs"
        containerName="uidesigns-and-animations"
        docName="UI Designs-Animations"
        data={data} loading={loading} />;
});

export default UiDesigns;
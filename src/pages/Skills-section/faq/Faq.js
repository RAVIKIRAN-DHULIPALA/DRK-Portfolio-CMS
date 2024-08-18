import { memo, useEffect, useState } from "react";
import MainContainer from "../../../Components/MainLayout-blue/MainContainer";
import { getDesignsData } from "../../../Firebase-utils/CallingMethods";

const Faq = memo(() => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Set up the onQuerySnapshot listener
        const unsubscribe = getDesignsData("Faq's", setData, "contents-1", setLoading)
        // Cleanup listener
        return () => unsubscribe();
    }, []);
    return <MainContainer title={"Faq's"}
        supportingText={"Place to manage, add Faq's in the portfolio"}
        buttonText={"faq's"}
        type="faq"
        docName="Faq's"
        data={data} loading={loading} />;
});

export default Faq;
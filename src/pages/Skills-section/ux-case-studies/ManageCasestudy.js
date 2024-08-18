import { memo, useEffect, useState } from "react";
import MainContainer from "../../../Components/MainLayout-blue/MainContainer";
import { getCaseStudyData } from "../../../Firebase-utils/CallingMethods";
import { useParams } from "react-router-dom";

const ManageCasestudy = memo(() => {
    const { id } = useParams();
    const [data, setData] = useState([]);
    useEffect(() => {
        // Set up the onQuerySnapshot listener
        const unsubscribe = getCaseStudyData(id, setData)
        // Cleanup listener
        return () => unsubscribe();
    }, []);

    return <MainContainer
        isManage={true}
        data={data}
        slug={id}
    />
})

export default ManageCasestudy;
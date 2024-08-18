import { memo, useEffect, useState } from "react";
import MainContainer from "../../Components/MainLayout-blue/MainContainer"
import { getCasestudyFolderContent } from "../../Firebase-utils/CallingMethods";
import { useParams } from "react-router-dom";

const CasestudyfolderContent = memo(() => {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Set up the onQuerySnapshot listener
        const unsubscribe = getCasestudyFolderContent(id, setData, setLoading);

        // Cleanup listener
        return () => unsubscribe();

    }, []);

    return <MainContainer
        title={id}
        type="content"
        data={data}
        id={id}
        isAsset={true}
        fromnav="Case study content"
        fromsec="Assets section"
        loading={loading}
    />
})

export default CasestudyfolderContent;
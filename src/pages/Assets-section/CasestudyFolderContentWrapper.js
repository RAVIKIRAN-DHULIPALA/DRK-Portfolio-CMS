import { memo, useState, useEffect } from "react";
import AsssetContentItemImage from "../../Components/ItemComponents/AssetContentItemImg";
import AssetContentItemNonimg from "../../Components/ItemComponents/AssetsContentNonImg";
import copy from 'clipboard-copy';

const CaseStudyFolderContentWrapper = memo(({ data, imagescontentTypes, videoContentTypes, id }) => {
    const { file_type } = data;
    const [copyData, setCopyData] = useState({
        img: "/assets/images/copy.svg",
        text: "Copy link",
        isDisabled: false
    })
    const handleCopyClick = (url) => {
        copy(url)
            .then(() => {
                setCopyData({ text: "Copied!", img: "/assets/images/name-check-gray.svg", isDisabled: true })
            })
            .catch((err) => {
                console.error('Error copying text to clipboard:', err);
            });
    };
    useEffect(() => {
        let timeoutId;

        if (copyData.text === 'Copied!') {
            timeoutId = setTimeout(() => {
                setCopyData({ text: "Copy link", img: "/assets/images/copy.svg", isDisabled: false })
            }, 4000);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [copyData]);

    return (
        (imagescontentTypes.includes(file_type) || videoContentTypes.includes(file_type)) ?
            <AsssetContentItemImage data={data} isVideo={videoContentTypes.includes(file_type)} id={id} copyData={copyData} handleCopyClick={handleCopyClick} /> :
            <AssetContentItemNonimg data={data} copyData={copyData} handleCopyClick={handleCopyClick} id={id} />
    )



})

export default CaseStudyFolderContentWrapper;
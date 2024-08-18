import { memo, useEffect, useState, useCallback } from "react";
import PageHeader from "./PageHeader";
import styles from "./MainContainer.module.css";
import ManageCaseStudies from "../../pages/Skills-section/ux-case-studies/ManageCasestudyContent";
import CardComp from "../ItemComponents/CardComp";
import UiDesignsComponent from "../ItemComponents/UiDesignComponent";
import EmptyState from "../states/EmptyState";
import { CircularProgress } from "@mui/material";
import Folder from "../ItemComponents/Folders";
import { Fileuploadbase } from "../Inputs/Fileuploadbase";
import PortalPopup from "../states/PortalPopup";
import AddNewFiles from "../ItemComponents/AddNewFiles";
import CaseStudyFolderContentWrapper from "../../pages/Assets-section/CasestudyFolderContentWrapper";
import ProfileSection from "../../pages/Profile-section";

const MainContainer = memo(({ title, supportingText, buttonText, type, data, isManage, slug, containerName, docName, loading, fromnav,
    fromsec, isAsset, id, isProfile }) => {
    const imagescontentTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    const videoContentTypes = ["video/mp4", "video/webm", "video/mov"];
    const docContentType = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/css", "text/html"];

    const accept = imagescontentTypes.concat(videoContentTypes, docContentType).toString();
    const [isAddNewFilesOpen, setAddNewFilesOpen] = useState(false);
    const openAddNewFiles = useCallback(() => {
        setAddNewFilesOpen(true);
    }, []);

    const closeAddNewFiles = useCallback(() => {
        setAddNewFilesOpen(false);
    }, []);

    return (
        <main className={styles.mainContainer}>
            {!isManage && <PageHeader datalength={!isProfile ? data.length : 0} title={title} desp={supportingText} buttonText={buttonText} fromnav={isAsset ? fromnav : type} docName={docName} fromsec={fromsec} isAsset={isAsset} isProfile={isProfile} containerName={containerName} />}
            <div className={isManage || isProfile ? styles.mainContentSection1 : (data.length > 0 || (type === "content" && !loading)) ? styles.mainContentSection : styles.mainContentSection2}>
                {isManage ? <ManageCaseStudies data={data} slug={slug} fromsec="Skills section" fromnav="UX case studies" /> : isProfile ? <ProfileSection containerName={containerName} docName={docName} /> :
                    data.length > 0 ? <div className={styles.mainContentContainer}>
                        {type === "content" && (<Fileuploadbase text={"Add files"} notupload={true} handleUpload={() => openAddNewFiles()} />
                            // : <FileUpload name={prg.title} progress={prg.progress} />
                        )
                        }
                        {data.map((e, i) => {
                            if (type === "folders") {
                                return <Folder key={i} title={e} />;
                            }
                            if (type === "content") {
                                return <CaseStudyFolderContentWrapper data={e} imagescontentTypes={imagescontentTypes} videoContentTypes={videoContentTypes} id={id} />;
                            }
                            if (type === "designs") {
                                return <UiDesignsComponent
                                    key={i}
                                    show={e.show}
                                    thumbnailIcon={e.thumbnail_url}
                                    thumbnailName={e.thumbnailName}
                                    type={type}
                                    docName={docName}
                                    containerName={containerName}
                                    video={e?.video}
                                    keyy={e.key}
                                />
                            }
                            else if (["casestudy", "post", "writing", "faq"].includes(type))
                                return <CardComp
                                    key={i}
                                    title={e.referenceTitle}
                                    link={type === "casestudy" ? `https://drk-staging.web.app/casestudy/${e.slug}` : e.slug}
                                    categoryName={e.category}
                                    contentAvailable={e.isAvailable}
                                    show={e.show}
                                    thumbnailIcon={e.thumbnail_url}
                                    thumbnailName={e.thumbnailName}
                                    type={type}
                                    docName={docName}
                                    question={e?.question}
                                    answer={e?.answer}
                                    containerName={containerName}
                                    slug={e.slug} />;
                        })}
                    </div> : loading ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--gap-5xs)" }}>
                        <CircularProgress color="primary" />
                        Loading...
                    </div> : type === "content" ? <Fileuploadbase text={"Add files"} notupload={true} handleUpload={() => openAddNewFiles()} /> : <EmptyState />
                }
            </div>
            {isAddNewFilesOpen && (
                <PortalPopup
                    overlayColor="rgba(113, 113, 113, 0.3)"
                    placement="Centered"
                >
                    <AddNewFiles onClose={closeAddNewFiles} accept={accept} id={id} />
                </PortalPopup>
            )}
        </main>
    );
});

export default MainContainer;

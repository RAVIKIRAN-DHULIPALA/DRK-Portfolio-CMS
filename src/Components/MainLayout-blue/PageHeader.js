import { memo, useState, useCallback, useEffect } from "react";
import styles from "./PageHeader.module.css";
import PortalDrawer from "../Navigation/PortalDrawer";
import AddNew from "../ItemComponents/AddNew";
import CategoryContent from "../ItemComponents/CategoryContent";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Reorder from '../ItemComponents/Reorder';


const PageHeader = memo(({ title, desp, buttonText, onclick, isManage, category, fromnav, fromsec, state, docName, containerName, isAsset, isProfile, datalength }) => {
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [isReorder, setIsReorder] = useState(false);

    const openProfile = useCallback(() => {
        setProfileOpen(true);
    }, []);

    const closeProfile = useCallback(() => {
        setProfileOpen(false);
    }, []);
    const openReorder = useCallback(() => {
        setIsReorder(true);
    }, []);

    const closeReorder = useCallback(() => {
        setIsReorder(false);
    }, []);
    const [titleName, settitleName] = useState("");
    const [LabelName, setLabelName] = useState("");
    useEffect(() => {
        switch (fromnav) {
            case "casestudy": settitleName("case studies"); setLabelName("case study"); break;
            case "post": settitleName("UX posts"); setLabelName("UX post"); break;
            case "writing": settitleName("writings"); setLabelName("writing"); break;
            case "designs": settitleName("designs"); setLabelName("design"); break;
        }
    }, [fromnav])


    const breadcrumbs = [

        <div className={styles.breadcrumbButtonBase} key="1">
            <div className={styles.text11}>{fromsec}</div>
        </div>
        ,
        <Link
            underline="hover"
            key="2"
            color="inherit"
            href={isManage ? "/skills-section/ux-case-studies" : "/assets-section/casestudycontent"}

        >
            <div className={styles.breadcrumbButtonBase}>
                <div className={styles.text11}>{fromnav}</div>
            </div>
        </Link>,

        <div className={styles.breadcrumbButtonBase2} key="3" >
            <div className={styles.addMore}>Manage</div>
        </div>
        ,
    ];
    return (
        <div className={styles.pageHeaderMainSection}>
            {(isManage || isAsset) && <Breadcrumbs
                separator={<img
                    className={styles.chevronRightIcon}
                    alt=""
                    src="/assets/images/chevron-right.svg"
                />}
                aria-label="breadcrumb"
            >
                {breadcrumbs}
            </Breadcrumbs>}
            <div className={(isManage || isAsset) ? styles.pageHeaderSection1 : styles.pageHeaderSection}>
                <div className={styles.pageHeaderContent}>
                    <h1 className={styles.headerText}>{title}</h1>
                    {isManage ? <CategoryContent categoryName={category} /> : !isProfile && <p className={styles.supportingText}>
                        {desp}
                    </p>}
                </div>
                <div className={styles.actions}>
                    {(isManage && !isAsset) ? <>
                        {state === "synced" ? <div className={styles.synced}>
                            <img
                                className={styles.icons4}
                                alt=""
                                src="/assets/images/icon-6.svg"
                            />
                            <div className={styles.text15}>Form synced</div>
                        </div> : state === "modified" ?
                            <div className={styles.syncingBadge}>
                                <img
                                    className={styles.icons4}
                                    alt=""
                                    src="/assets/images/icon-7.svg"
                                />
                                <div className={styles.text16}>Data syncing...</div>
                            </div> :
                            <div className={styles.syncFailed}>
                                <img
                                    className={styles.icons4}
                                    alt=""
                                    src="/assets/images/icon-8.svg"
                                />
                                <div className={styles.text17}>
                                    Syncing failed! Data saved locally.
                                </div>
                            </div>
                        }
                    </> : (!isAsset && (fromnav !== "folders") && !isProfile) ? <>
                        {(fromnav !== "designs" && datalength >= 2) && <button className={styles.reorderButton} type="button" onClick={openReorder}>
                            <img className={styles.icons} alt="" src="/assets/images/reorder.svg" />
                            <div className={styles.text}>Re-order</div>
                        </button>}
                        <button className={styles.addNewButton} onClick={openProfile}>
                            <img className={styles.icons} alt="" src="/assets/images/add.svg" />
                            <div className={styles.text1}>Add new {buttonText}</div>
                        </button>
                    </> : ""}
                </div>
                {(isProfileOpen || isReorder) && (
                    <PortalDrawer
                        overlayColor="rgba(113, 113, 113, 0.3)"
                        placement="Right"
                        onOutsideClick={isProfileOpen ? closeProfile : closeReorder}
                    >
                        {isProfileOpen &&
                            <AddNew onClose={closeProfile}
                                type={fromnav}
                                title={titleName}
                                label={LabelName}
                                docName={docName}
                                containerName={containerName} />}
                        {isReorder && <Reorder onClose={closeReorder} docName={docName} title={titleName} />}

                    </PortalDrawer>
                )}
            </div>
        </div>
    );
});

export default PageHeader;

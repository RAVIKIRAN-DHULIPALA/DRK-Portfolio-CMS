import { useState, memo } from "react";
import styles from "./CardComp.module.css";
import { IOSSwitch } from "../Inputs/IOSSwitch";
import { updateShow } from "../../Firebase-utils/CallingMethods";
import ActionMenu from "../Inputs/ActionMenu";
import CategoryContent from "./CategoryContent";
import { useNavigate } from "react-router-dom";

const CardComp = memo(
    ({ title, slug, link, thumbnailIcon, thumbnailName, categoryName, contentAvailable, show, type, docName, containerName, question, answer }) => {
        const [checked, setChecked] = useState(show);
        const handleShow = (event) => {
            updateShow(docName, type === "casestudy" ? slug : type === "post" ? categoryName : title, event.target.checked, type);
            setChecked(event.target.checked);
        }
        const [anchorEl, setAnchorEl] = useState(null);
        const open = Boolean(anchorEl);
        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };
        const navigate = useNavigate();
        const handleClose = () => {
            setAnchorEl(null);
        };
        return (
            <div className={styles.uxCaseStudies}>
                <div className={styles.cardItemContent}>
                    <div className={styles.cardItemHeader}>
                        <div className={styles.thumbnailtitleslug}>
                            {type !== "faq" && <img
                                className={styles.thumbnailIcon}
                                loading="lazy"
                                alt=""
                                src={thumbnailIcon}
                            />}
                            <div className={styles.titleslug}>
                                <h3 className={styles.title}>{type === "faq" ? question : title}</h3>
                                {type === "faq" && <p className={styles.untitleduicomprojectmarketi}>
                                    {answer}
                                </p>}
                                {(type !== "faq" && contentAvailable) && <a className={styles.iconAndText} href={link} target="_blank">
                                    <img className={styles.linkIcon} alt="" src="/assets/images/link.svg" />
                                    {type !== "design" && <p className={styles.untitleduicomprojectmarketi}>
                                        {type === "casestudy" ? slug : type === "post" ? "View post" : "View blog"}
                                    </p>}
                                </a>}
                            </div>
                        </div>
                        <button className={styles.moreVertical}
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            id="basic-button"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            <img className={styles.icon} alt="" src="/assets/images/more-vertical.svg" />
                        </button>
                        <ActionMenu open={open} anchorEl={anchorEl} handleClose={handleClose} slug={type === "casestudy" ? slug : type === "post" ? categoryName : type === "faq" ? question : title} thumbnailName={thumbnailName} type={type} docName={docName} containerName={containerName} />
                    </div>
                    {(type === "casestudy" || type === "post") && contentAvailable ? (
                        <CategoryContent categoryName={categoryName} />
                    ) : ""}
                </div>
                {type !== "faq" && <div className={styles.actions}>
                    <div className={styles.divider} />
                    <div className={styles.actionsContent}>
                        {type === "casestudy" && <button className={styles.manageButton} onClick={() => { navigate(`/skills-section/ux-case-studies/manage/${slug}`) }}>
                            <img
                                className={styles.manageIcon}
                                alt=""
                                src="/assets/images/manage-icon.svg"
                            />
                            <div className={styles.manage}>Manage</div>
                        </button>}
                        <IOSSwitch checked={checked} onChange={handleShow} />
                    </div>
                </div>}
            </div>
        );
    }
);

export default CardComp;

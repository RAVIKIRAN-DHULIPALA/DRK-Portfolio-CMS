import { useState, memo } from "react";
import styles from "./UiDesigns.module.css";
import { IOSSwitch } from "../Inputs/IOSSwitch";
import { updateShow } from "../../Firebase-utils/CallingMethods";
import ActionMenu from "../Inputs/ActionMenu";

const UiDesignsComponent = memo(({ docName, containerName, thumbnailIcon, thumbnailName, show, keyy, type, video }) => {
    const [checked, setChecked] = useState(show);
    const handleShow = (event) => {
        updateShow(docName, keyy, event.target.checked, type);
        setChecked(event.target.checked);
    }
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className={styles.uiDesigns}>
            <div className={styles.actions}>
                <IOSSwitch checked={checked} onChange={handleShow} />
            </div>
            <div className={styles.cardItemContentUidesigns}>
                <div className={styles.cardItemHeaderUidesigns}>
                    {video ? <video autoPlay loop={true} className={styles.thumbnailIcon}  >
                        <source src={thumbnailIcon} type="video/mp4"></source>
                    </video> :
                        <img
                            className={styles.thumbnailIcon}
                            loading="lazy"
                            alt=""
                            src={thumbnailIcon}
                        />}
                    <button className={styles.moreVertical} aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        id="basic-button"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick} type="button">
                        <img className={styles.icon} alt="" src="/assets/images/more-vertical.svg" />
                    </button>
                    <ActionMenu open={open} anchorEl={anchorEl} handleClose={handleClose} thumbnailName={thumbnailName} slug={keyy} type={type} docName={docName} containerName={containerName} />
                </div>
            </div>
        </div>
    );
});

export default UiDesignsComponent;

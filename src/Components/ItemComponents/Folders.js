import { memo } from "react";
import styles from "./Folder.module.css";
import { useNavigate } from "react-router-dom";

const Folder = memo(({ title }) => {
    const navigate = useNavigate();
    return (
        <div className={styles.folder}>
            <div className={styles.titleAndView}>
                <div className={styles.iconAndTitle}>
                    <img
                        className={styles.featuredIcon}
                        alt=""
                        src="/assets/images/folders-icon.svg"
                    />
                    <h3 className={styles.title}>{title}</h3>
                </div>
                <button className={styles.viewButton} onClick={() => { navigate(`/assets-section/casestudycontent/manage/${title}`) }} >
                    <div className={styles.view}>View</div>
                    <img className={styles.icons} alt="" src="/assets/images/manage-icon.svg" />
                </button>
            </div>
        </div>
    );
});

export default Folder;

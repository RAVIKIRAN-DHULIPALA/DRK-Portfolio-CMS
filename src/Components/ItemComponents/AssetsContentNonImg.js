import { memo } from "react";
import styles from "./AssetContentItemNonimg.module.css";
import { deleteFolderContent } from "../../Firebase-utils/CallingMethods";

const AssetContentItemNonimg = memo(({ data, copyData, handleCopyClick, id }) => {

    return (
        <div className={styles.assetContentItemNonimg}>
            <div className={styles.actions}>
                <h6 className={styles.nameOfThe}>{data.file_name}</h6>
                <button className={styles.cancelButton} type="button" disabled={copyData.isDisabled} onClick={() => handleCopyClick(data.file_url)}>
                    <img className={styles.icons} alt="" src={copyData.img} />
                    <div className={styles.text}>{copyData.text}</div>
                </button>
            </div>
            <div className={styles.cardItemContent}>
                <div className={styles.cardItemHeader}>
                    <img className={styles.file04Icon} alt="" src="/assets/images/file-04.svg" />
                    <button className={styles.deleteButton} type="button" onClick={() => deleteFolderContent(id, data.file_name, data.key)}>
                        <img className={styles.deleteIcon} alt="" src="/assets/images/delete.svg" />
                    </button>
                </div>
            </div>
        </div>
    );
});

export default AssetContentItemNonimg;

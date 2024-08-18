import { memo, useState, useEffect } from "react";
import styles from "./AsssetContentItemImage.module.css";
import { deleteFolderContent } from "../../Firebase-utils/CallingMethods";


const AsssetContentItemImage = memo(({ data, isVideo, copyData, handleCopyClick, id }) => {

    return (
        <div className={styles.asssetContentItemImage}>
            <div className={styles.actions}>
                <h6 className={styles.nameOfThe}>{data.file_name}</h6>
                <button className={styles.cancelButton} type="button" disabled={copyData.isDisabled} onClick={() => handleCopyClick(data.file_url)}>
                    <img className={styles.icons} alt="" src={copyData.img} />
                    <div className={styles.text}>{copyData.text}</div>
                </button>
            </div>
            <div className={styles.cardItemContent}>
                <div className={styles.cardItemHeader}>
                    {isVideo ? <video autoPlay loop={true} className={styles.thumbnailIcon}  >
                        <source src={data.file_url} type="video/mp4"></source>
                    </video> :
                        <img
                            className={styles.thumbnailIcon}
                            loading="lazy"
                            alt=""
                            src={data.file_url}
                        />}
                    <button className={styles.deleteButton} type="button" onClick={() => deleteFolderContent(id, data.file_name, data.key)}>
                        <img className={styles.deleteIcon} alt="" src="/assets/images/delete.svg" />
                    </button>
                </div>
            </div>
        </div>
    );
});

export default AsssetContentItemImage;

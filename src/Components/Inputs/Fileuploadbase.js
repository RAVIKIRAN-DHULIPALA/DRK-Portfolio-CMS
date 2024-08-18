import React from "react";
import styles from "../ItemComponents/AddNew.module.css";
export function Fileuploadbase({
    handleUpload,
    handleFileChange,
    index,
    accept,
    text, id,
    name,
    multiple,
    notupload
}) {

    return <div className={styles.fileUploadBase} id="fileuploadbase" onClick={handleUpload}>
        <div className={styles.content}>
            <img className={styles.UploadIcon} alt="" src="/assets/images/upload-fe.svg" />
            <div className={styles.textAndSupportingText1}>
                <div className={styles.action}>
                    <div className={styles.uploadText}>{text}
                        {!notupload && <input hidden name={name} // value={form.thumbnail_url}
                            // index={index}
                            required={true} multiple={multiple} type="file" accept={accept} id={id} onChange={(event) => { handleFileChange(event, index) }} />}
                    </div>
                </div>
            </div>
        </div>
    </div>;
}

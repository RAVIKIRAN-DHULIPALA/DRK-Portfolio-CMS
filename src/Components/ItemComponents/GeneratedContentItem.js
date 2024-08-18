import { memo } from "react";
import styles from "./GeneratedContentItem.module.css";

const GeneratedContentItem = memo(({ index, text, formdata, setFormData, setState }) => {
    return (
        <div className={styles.generatedContentItem}>
            <div className={styles.headingAndCopy}>
                <h5 className={styles.heading}>Description {index}</h5>
                <button className={styles.cancelButton} type="button" onClick={() => {
                    setState("modified");
                    let data = { ...formdata };

                    data["desp"] = text;
                    setFormData(data);
                }}>
                    <div className={styles.text}>Fill description</div>
                    <img className={styles.icons} alt="" src="/icons.svg" />
                </button>
            </div>
            <p
                className={styles.generatedText}
            >{text}</p>
        </div>
    );
});

export default GeneratedContentItem;

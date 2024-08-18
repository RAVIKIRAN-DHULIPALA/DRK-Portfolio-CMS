import React from "react";
import styles from "./AddNew.module.css";

export function ActionsFooter({
    onClose, action
}) {
    return <div className={styles.actionsFooter}>
        <div className={styles.divider1} />
        <div className={styles.actionsFooterContent}>
            <button className={styles.cancelButton} onClick={onClose}>
                <div className={styles.text1}>Cancel</div>
            </button>
            <button className={styles.saveButton} type="submit" onClick={() => action()}>
                <div className={styles.text4}>Save</div>
            </button>
        </div>
    </div>;
}

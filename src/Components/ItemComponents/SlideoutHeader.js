import React from "react";
import styles from "./AddNew.module.css";
import styless from "./Edit.module.css";

export function SlideoutHeader({
    onClose, type, isEdit, content, isOrder
}) {
    return <div className={styles.slideOutMenuHeader}>
        <div className={styles.contentH}>
            <h4 className={styles.slideOutHeading}>{isEdit ? `Editing ${type}` : isOrder ? `Re-order ${type}` : `Add new ${type}`}</h4>
            {isEdit && <p className={styless.slug}>{content}</p>}
        </div>
        <button className={styles.closeButton} onClick={onClose}>
            <div className={styles.buttonBase}>
                <img className={styles.xIcon} alt="" src="/assets/images/close.svg" />
            </div>
        </button>
    </div>;
}

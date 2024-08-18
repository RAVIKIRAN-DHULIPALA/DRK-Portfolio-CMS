import { memo } from "react";
import styles from "./EmptyState.module.css";

const EmptyState = memo(() => {
    return (
        <div className={styles.emptyState}>
            <div className={styles.content}>
                <img
                    className={styles.documentsrafikiIcon}
                    alt=""
                    src="/assets/images/documents-rafiki.svg"
                />
                <div className={styles.textAndSupportingText}>
                    <h5 className={styles.text}>Empty Canvas</h5>
                    <p className={styles.supportingText}>
                        Looks like this space is feeling a bit emptier -no documents or
                        items found yet. 😀
                    </p>
                </div>
            </div>
        </div>
    );
});

export default EmptyState;

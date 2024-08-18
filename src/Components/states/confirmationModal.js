import { memo, useState } from "react";
import styles from "./ConfirmationPopup.module.css";
import InputComponent from "../Inputs/InputComponent";

const ConfirmationPopup = memo(({ onClose, docName, slug, deleteMethod }) => {
    const [isEnabled, SetIsEnabled] = useState(false);
    const handleFormChange = (event) => {
        if (event.target.value === slug) {
            SetIsEnabled(true);
        }
        else {
            SetIsEnabled(false);
        }
    }
    return (
        <div className={styles.confirmationpopup}>
            <div className={styles.content}>
                <img
                    className={styles.featuredIcon}
                    alt="delete icon"
                    loading="eager"
                    src="/assets/images/delete-icon.svg"
                />
                <div className={styles.textAndSupportingText}>
                    <h6 className={styles.text}>Delete {slug}</h6>
                    <p className={styles.supportingText}>
                        <span className={styles.areYouSureYouWantToDelet}>
                            <span className={styles.areYouSureYouWantToDelet1}>
                                <span>
                                    Are you sure you want to delete this item?
                                </span>
                            </span>
                        </span>
                        <span className={styles.areYouSureYouWantToDelet}>
                            <span className={styles.areYouSureYouWantToDelet1}>
                                <span>This will permanently delete</span>
                                <span className={styles.span}>{` `}</span>
                            </span>
                            <span className={styles.slug}>
                                <span className={styles.type}>{slug}</span>
                                <span className={styles.span1}>{` `}</span>
                            </span>
                            <span className={styles.documentFromType}>
                                <span className={styles.documentFrom}>document from</span>
                                <span className={styles.span}>{` `}</span>
                                <span className={styles.type}>{docName}</span>
                            </span>
                        </span>
                    </p>
                </div>
                <InputComponent
                    type={"text"}
                    isLabel={true}
                    label="Please enter name to proceed"
                    change={handleFormChange}
                />
            </div>
            <div className={styles.actions}>
                <button className={styles.cancelButton} type="button" onClick={onClose}>
                    <div className={styles.text1}>Cancel</div>
                </button>
                <button className={isEnabled ? styles.deleteButton : styles.deleteButtonDis} onClick={() => { deleteMethod(); onClose(); }} type="button" disabled={!isEnabled}>
                    <div className={styles.text2}>Delete</div>
                </button>
            </div>
        </div>
    );
});

export default ConfirmationPopup;

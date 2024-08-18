import React from "react";
import styles from "./CardComp.module.css";


const CategoryContent = ({ categoryName }) => {
    return (<div className={styles.categoryContentAvailable}>
        <div className={styles.categoryBadge}>
            <div className={styles.categoryTitle}>Category</div>
            <img className={styles.availabilityIcon} alt="" src="/assets/images/availability-icon.svg" />
        </div>
        <p className={styles.categoryName}>{categoryName}</p>
    </div>);
}
export default CategoryContent;

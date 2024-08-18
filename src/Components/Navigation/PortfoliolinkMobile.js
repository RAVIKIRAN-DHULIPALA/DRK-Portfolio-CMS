import React from "react";
import styles from "./Profile.module.css";

export function PortfoliolinkMobile({ name, link }) {
    return <div className={styles.mainPortfolioMobile}>
        <p className={styles.portfolioTextMobile}>{name}</p>
        <a className={styles.visit} href={link} target="_blank">
            <div className={styles.buttonBase1}>
                <div className={styles.text9}>Visit</div>
                <img className={styles.icons1} alt="" src="/assets/images/link-blue.svg" />
            </div>
        </a>
    </div>;
}

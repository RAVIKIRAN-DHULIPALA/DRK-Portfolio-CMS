import React from "react";
import styles from "./MainNavigation.module.css";
export function PortfolioLink({ name, link }) {
    return <div className={styles.mainPortfolio}>
        <p className={styles.portfolioText}>{name}</p>
        <a className={styles.visit} href={link} target="_blank">
            <div className={styles.buttonBase}>
                <div className={styles.text9}>Visit</div>
                <img className={styles.logOutIcon} alt="" src="/assets/images/external-link.svg" />
            </div>
        </a>
    </div>;
}

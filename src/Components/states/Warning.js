import styles from "./Warning.module.css";

const Warning = ({ text }) => {
    return (
        <div className={styles.warningDiv} id="confimed">
            <img className={styles.featuredIcon} alt="info" src="../assets/images/featured-icon2.svg" />
            <div>
                <p className={styles.textP}>{text}</p>
            </div>
        </div>
    );
};

export default Warning;

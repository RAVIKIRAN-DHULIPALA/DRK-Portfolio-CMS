import { memo } from "react";
import MainNavigation from "../Navigation/MainNavigaition";
import styles from "./Dashboard.module.css";
import { Outlet } from "react-router-dom";
import { getAuth } from "firebase/auth";

const Dashboard = memo(() => {

    return (
        <div className={styles.mainFrame}>
            <MainNavigation />
            <section className={styles.mainWrap}>
                <Outlet />
            </section>
        </div>
    );

});

export default Dashboard;


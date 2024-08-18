import { PortfoliolinkMobile } from './PortfoliolinkMobile';
import { memo, useEffect, useState } from "react";
import { Button, useStepContext } from "@mui/material";
import styles from "./Profile.module.css";
import { NavLink } from "react-router-dom";
import { Avatar } from "@mui/material";
import stringAvatar from "../../Providers/ColoredAvatar";
import { useNavigate } from 'react-router-dom';
import { getOrderedData, getUserData } from '../../Firebase-utils/CallingMethods';

const Profile = memo(({ onClose, signout }) => {
    const navigate = useNavigate();
    useEffect(() => {
        const scrollAnimElements = document.querySelectorAll(
            "[data-animate-on-scroll]"
        );
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting || entry.intersectionRatio > 0) {
                        const targetElement = entry.target;
                        targetElement.classList.add(styles.animate);
                        observer.unobserve(targetElement);
                    }
                }
            },
            {
                threshold: 0.15,
            }
        );

        for (let i = 0; i < scrollAnimElements.length; i++) {
            observer.observe(scrollAnimElements[i]);
        }

        return () => {
            for (let i = 0; i < scrollAnimElements.length; i++) {
                observer.unobserve(scrollAnimElements[i]);
            }
        };
    }, []);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null)
    const detFunc = () => {
        const userUnsubscribe = getUserData(setUser);
        const unsubscribe = getOrderedData("portfolioLinks", setData, "links", setLoading);
        // Cleanup listener
        return () => {
            unsubscribe(); userUnsubscribe();
        }
    }
    useEffect(() => {
        detFunc();
    }, [])
    useEffect(() => {
        const userUnsubscribe = getUserData(setUser);
        return () => userUnsubscribe();
    }, [user])
    useEffect(() => {
        const unsubscribe = getOrderedData("portfolioLinks", setData, "links", setLoading);
        // Cleanup listener
        return () =>
            unsubscribe();

    }, [data])

    return (
        <div className={styles.profile} data-animate-on-scroll>
            <div className={styles.headerContainer}>
                <div className={styles.header}>
                    {user?.photoURL !== null ?
                        <img
                            className={styles.avatarProfilePhoto}
                            alt=""
                            src={user?.photoURL}
                            onClick={() => navigate("/profile")}
                        /> : <Avatar className={styles.avatarProfilePhoto} {...stringAvatar(user?.displayName)} onClick={() => navigate("/profile")} />
                    }
                    <div className={styles.textAndSupportingText} >
                        <h1 className={styles.name}>{user?.displayName}</h1>
                        <p className={styles.email}>{user?.email}</p>
                    </div>
                    <button className={styles.button} onClick={onClose}>
                        <div className={styles.buttonBase}>
                            <img className={styles.icons} alt="" src="/assets/images/close.svg" />
                        </div>
                    </button>
                </div>
                <div className={styles.divider} />
            </div>
            <nav className={styles.content}>
                <div className={styles.skillsNavigationMobile}>
                    <h6 className={styles.skillsSectionHeadingMobile}>
                        <img alt="" src={"/assets/images/skill-blue.svg"} />
                        Skills section</h6>
                    <div className={styles.skillsNavigationMenuMobile}>
                        <NavLink to="/skills-section/ux-case-studies" className={({ isActive }) =>
                            isActive ? styles.navItemMobileActive : styles.navItemMobile
                        } onClick={onClose} >
                            <div className={styles.content1}>
                                <div className={styles.text}>UX case studies</div>
                            </div>
                        </NavLink>

                        <NavLink to="/skills-section/uxposts" className={({ isActive }) =>
                            isActive ? styles.navItemMobileActive : styles.navItemMobile
                        }>
                            <div className={styles.content1}>
                                <div className={styles.text}>UX posts</div>
                            </div>
                        </NavLink>
                        <NavLink to="/skills-section/mywritings" className={({ isActive }) =>
                            isActive ? styles.navItemMobileActive : styles.navItemMobile
                        }>
                            <div className={styles.content1}>
                                <div className={styles.text}>My writings</div>
                            </div>
                        </NavLink>
                        <NavLink to="/skills-section/designs" className={({ isActive }) =>
                            isActive ? styles.navItemMobileActive : styles.navItemMobile
                        }>
                            <div className={styles.content1}>
                                <div className={styles.text}>UI designs</div>
                            </div>
                        </NavLink>
                        <NavLink to="/skills-section/faq" className={({ isActive }) =>
                            isActive ? styles.navItemMobileActive : styles.navItemMobile
                        }>
                            <div className={styles.content1}>
                                <div className={styles.text}>FAQ’s</div>
                            </div>
                        </NavLink>
                    </div>
                </div>
                <div className={styles.skillsNavigationMobile}>
                    <h6 className={styles.skillsSectionHeadingMobile}>
                        <img alt="" src={"/assets/images/assets-blue.svg"} />
                        Assets section
                    </h6>
                    <div className={styles.skillsNavigationMenuMobile}>
                        <NavLink to="/assets-section/casestudycontent" className={({ isActive }) =>
                            isActive ? styles.navItemMobileActive : styles.navItemMobile
                        }>
                            <div className={styles.content1}>
                                <div className={styles.text}>Case study content</div>
                            </div>
                        </NavLink>
                    </div>
                </div>
                <div className={styles.portfolioLinksMobile}>
                    <h6 className={styles.portfolioLinksHeadingMobile}>
                        Portfolio links
                    </h6>
                    {(data !== null && data.length) ? data.splice(0, 2).map((element, index) => {
                        return <PortfoliolinkMobile key={index} name={element.name} link={element.link} />
                    }) : ""}

                </div>
            </nav>
            <footer className={styles.actionsFooter}>
                <Button
                    sx={{ width: 264 }}
                    color="error"
                    size="medium"
                    disableElevation={true}
                    variant="contained"
                    onClick={() => { signout(); onClose(); }}
                >
                    Logout
                </Button>
            </footer>
        </div>
    );
});

export default Profile;

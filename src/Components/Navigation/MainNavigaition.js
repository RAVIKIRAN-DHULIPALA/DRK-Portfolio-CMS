import { PortfolioLink } from './PortfolioLink';
import { memo, useState, useCallback, useEffect } from "react";
import Profile from "./Profile";
import PortalDrawer from "./PortalDrawer";
import styles from "./MainNavigation.module.css";
import MenuAccordian from "./MenuAccordian";
import { isDesktop } from 'react-device-detect';
import { useMediaQuery } from 'react-responsive'
import { Avatar } from "@mui/material";
import stringAvatar from "../../Providers/ColoredAvatar";
import { getOrderedData, getUserData } from '../../Firebase-utils/CallingMethods';
import { auth, signOut } from '../../Firebase-utils/config'
import ActionMenuProfile from '../Inputs/ActionMenuProfile';
import { useNavigate } from 'react-router-dom';
import { sendEmailVerification, updateProfile } from "firebase/auth";


const MainNavigaition = memo(() => {
    const [isProfileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const openProfile = useCallback(() => {
        setProfileOpen(true);
    }, []);

    const closeProfile = useCallback(() => {
        setProfileOpen(false);
    }, []);
    const [expanded, setExpanded] = useState(0);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 992px)' })
    const signout = () => {
        signOut(auth)
            .then(() => {
                sessionStorage.removeItem("user");
                navigate("/", { replace: true });
            })
            .catch((error) => {
                // An error happened.
            });
    }
    return (
        <>
            <div className={styles.navigation}>
                {/* Sidebar navigation start */}
                {isDesktop ?
                    (isTabletOrMobile ?
                        <MobileNav openProfile={openProfile} /> :
                        <SideNav expanded={expanded} setExpanded={setExpanded} signOut={signout} />
                    )
                    :
                    <MobileNav openProfile={openProfile} />
                }
                {/* Mobile navigation End */}
            </div>
            {isProfileOpen && (
                <PortalDrawer
                    overlayColor="rgba(113, 113, 113, 0.3)"
                    placement="Right"
                    onOutsideClick={closeProfile}
                >
                    <Profile onClose={closeProfile} signout={signout} />
                </PortalDrawer>
            )}
        </>
    );
});

export default MainNavigaition;

const SideNav = memo(({ expanded, setExpanded, signOut }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [user, setUser] = useState(null);
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

    }, [data]);

    return (<nav className={styles.sidebarNavigation}>
        <div className={styles.navHeader}>
            <img className={styles.logoRk2Icon} alt="" src="/assets/images/logork-2.svg" />
            <span className={styles.portfolioCms}>Portfolio CMS</span>
        </div>
        <div className={styles.mainNavigation}>
            <div className={styles.mainNavigationContainer}>
                {
                    /* skills accordian */
                }
                <MenuAccordian i={0} expanded={expanded} setExpanded={setExpanded} type="skills" />

                {
                    /* assets accordian */
                }
                <MenuAccordian i={1} expanded={expanded} setExpanded={setExpanded} type="assets" />

            </div>
            <div className={styles.portfolioLinksContainer}>
                <div className={styles.portfolioLinks}>
                    <h6 className={styles.portofolioLinksSectionHeadi}>
                        Portfolio links
                    </h6>
                    {(data !== null && data.length) ? data.splice(0, 2).map((element, index) => {
                        return <PortfolioLink key={index} name={element.name} link={element.link} />
                    }) : ""}

                </div>
            </div>
        </div>
        <footer className={styles.footer}>
            <img className={styles.dividerIcon} alt="" src="/divider.svg" />
            <div className={styles.account}>
                <div className={styles.content}>
                    {(user?.photoURL !== null ? <img className={styles.avatarIcon} name="profile-image" alt="" src={user?.photoURL} />
                        : <Avatar className={styles.avatarIcon} {...stringAvatar(user?.displayName)} />)}
                    <div className={styles.nameemail}>
                        <h5 className={styles.nameText}>{user?.displayName}</h5>
                        <p className={styles.emailText}>{user?.email}</p>
                    </div>
                </div>
                <button className={styles.logoutButton}
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    id="basic-button"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <img className={styles.logOutIcon} alt="" src="/assets/images/manage-icon-profile.svg" />
                </button>
                <ActionMenuProfile open={open} anchorEl={anchorEl} handleClose={handleClose} signout={signOut} />
            </div>
        </footer>
    </nav>);
}
);

const MobileNav = memo(({ openProfile, user }) => {
    return (<nav className={styles.mobilenavigation}>
        <div className={styles.logo}>
            <img className={styles.logoRk2Icon} alt="" src="/assets/images/logork-2.svg" />
            <span className={styles.portfolioCms1}>Portfolio CMS</span>
        </div>
        <button className={styles.menu04} onClick={openProfile}>
            <img className={styles.icon} alt="" src="/assets/images/icon.svg" />
        </button>
    </nav>);
}
);

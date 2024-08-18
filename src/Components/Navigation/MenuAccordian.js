import { memo } from "react";
import styles from "./MainNavigation.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";

const MenuAccordian = memo(({ i, expanded, setExpanded, type }) => {
    const isOpen = i === expanded;
    return <div className={type === "skills" ? styles.skillsNavigation : styles.assetsNavigation}>
        <motion.header
            initial={false}
            onClick={() => setExpanded(isOpen ? false : i)}
            className={styles.motionHeader}
        >
            <div className={styles.accordianHeader}>
                <h6 className={styles.skillsSectionHeading}>
                    <img alt="" src={type === "skills" ? "/assets/images/skill.svg" : "/assets/images/asset.svg"} />
                    {type === "skills" ? "Skills section" : "Assets section"}
                </h6>
                <img className={styles.icons} style={{ rotate: isOpen ? "180deg" : "" }} alt="" src="/assets/images/cheveron.svg" />
            </div>
        </motion.header>
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.section
                    className={styles.motionSection}
                    key="content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 },
                    }}
                    transition={{ duration: 0.7, ease: [0.04, 0.32, 0.23, 0.58] }}
                >
                    {type === "skills" ? <div className={styles.skillsNavigationMenu}>
                        <NavLink to="/skills-section/ux-case-studies" className={({ isActive }) =>
                            isActive ? styles.navItemActive : styles.navItem
                        } replace="true" >
                            <div className={styles.content}>
                                <div className={styles.text}>UX case studies</div>
                            </div>
                        </NavLink>
                        <NavLink to="/skills-section/uxposts" className={({ isActive }) =>
                            isActive ? styles.navItemActive : styles.navItem
                        } >
                            <div className={styles.content}>
                                <div className={styles.text}>UX posts</div>
                            </div>
                        </NavLink>
                        <NavLink to="/skills-section/mywritings" className={({ isActive }) =>
                            isActive ? styles.navItemActive : styles.navItem
                        } >
                            <div className={styles.content}>
                                <div className={styles.text}>My writings</div>
                            </div>
                        </NavLink>
                        <NavLink to="/skills-section/designs" className={({ isActive }) =>
                            isActive ? styles.navItemActive : styles.navItem
                        } >
                            <div className={styles.content}>
                                <div className={styles.text}>UI designs</div>
                            </div>
                        </NavLink>
                        <NavLink to="/skills-section/faq" className={({ isActive }) =>
                            isActive ? styles.navItemActive : styles.navItem
                        } >
                            <div className={styles.content}>
                                <div className={styles.text}>FAQ’s</div>
                            </div>
                        </NavLink>
                    </div> : <div className={styles.skillsNavigationMenu}>
                        <NavLink to="/assets-section/casestudycontent" className={({ isActive }) =>
                            isActive ? styles.navItemActive : styles.navItem
                        } >
                            <div className={styles.content}>
                                <div className={styles.text}>Case study content</div>
                            </div>
                        </NavLink>

                    </div>}
                </motion.section>
            )}
        </AnimatePresence>
    </div>
});

export default MenuAccordian;
import { memo } from "react";
import styles from "./ActionMenu.module.css";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";


const ActionMenuProfile = memo(({ anchorEl, open, handleClose, signout }) => {
    const navigate = useNavigate();
    return (

        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            className={styles.dropdownMenu}>
            <div className={styles.dropdownMenuBase}>
                <MenuItem className={styles.dropdownListItem} onClick={() => { navigate("/profile"); handleClose() }} >
                    <img className={styles.icons} alt="" src="/assets/images/profile.svg" />
                    <div className={styles.text}>Profile</div>
                </MenuItem>
                <MenuItem className={styles.dropdownListItem1} onClick={() => { signout(); handleClose(); }}>
                    <img className={styles.icons} alt="" src="/assets/images/logout.svg" />
                    <div className={styles.text}>Logout</div>
                </MenuItem>
            </div>
        </Menu>


    );
});


export default ActionMenuProfile;

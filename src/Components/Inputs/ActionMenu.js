import { memo, useState, useCallback } from "react";
import styles from "./ActionMenu.module.css";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PortalDrawer from "../Navigation/PortalDrawer";
import { deleteFieldData } from "../../Firebase-utils/CallingMethods";
import Edit from "../ItemComponents/Edit";
import PortalPopup from "../states/PortalPopup";
import ConfirmationPopup from "../states/confirmationModal";


const ActionMenu = memo(({ anchorEl, open, handleClose, slug, thumbnailName, type, docName, containerName }) => {
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [isConfirmationPopupOpen, setConfirmationPopupOpen] = useState(false);

    const openConfirmationPopup = useCallback(() => {
        setConfirmationPopupOpen(true);
    }, []);

    const closeConfirmationPopup = useCallback(() => {
        setConfirmationPopupOpen(false);
    }, []);


    const openProfile = useCallback(() => {
        setProfileOpen(true);
    }, []);

    const closeProfile = useCallback(() => {
        setProfileOpen(false);
    }, []);
    return (
        <>
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
                    {type !== "designs" && <MenuItem className={styles.dropdownListItem} onClick={() => { openProfile(); handleClose() }} >
                        <img className={styles.icons} alt="" src="/assets/images/edit.svg" />
                        <div className={styles.text}>Edit {type} data</div>
                    </MenuItem>}
                    <MenuItem className={styles.dropdownListItem1} onClick={() => { openConfirmationPopup(); handleClose(); }}>
                        <img className={styles.icons} alt="" src="/assets/images/delete.svg" />
                        <div className={styles.text}>Delete</div>
                    </MenuItem>
                </div>
            </Menu>
            {isProfileOpen && (
                <PortalDrawer
                    overlayColor="rgba(113, 113, 113, 0.3)"
                    placement="Right"
                    onOutsideClick={closeProfile}
                >
                    <Edit onClose={closeProfile} slug={slug} docName={docName} containerName={containerName} type={type} />
                </PortalDrawer>
            )}
            {isConfirmationPopupOpen && (
                <PortalPopup
                    overlayColor="rgba(113, 113, 113, 0.3)"
                    placement="Centered"
                >
                    <ConfirmationPopup onClose={closeConfirmationPopup} type={type} slug={slug} docName={docName} deleteMethod={() => deleteFieldData(docName, slug, thumbnailName, type, containerName)} />
                </PortalPopup>
            )}
        </>
    );
});


export default ActionMenu;

import styles from './FileUpload.module.css';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
export const LinearProgressWithLabel = (props) => {
    return (
        <div className={styles.progressBar}>
            <div className={styles.progressBar1}>
                <LinearProgress variant="determinate" className={styles.progress1} {...props} sx={{
                    "& .MuiLinearProgress-bar": {
                        backgroundColor: "var(--blue-600) !important",
                        borderRadius: "8px"
                    }
                }} />
            </div>
            <div className={styles.percentage}>{`${Math.round(
                props.value,
            )}%`}</div>
        </div>

    );
}

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
};

const FileUpload = ({ name, size, progress, isUploaded, deleteFunction }) => {

    return (
        <div className={styles.fileUpload}>
            <div className={styles.content}>
                <img className={styles.fileUploadIcon1} alt="" src="/assets/images/image-upload.svg" />
                <div className={styles.filenameSizeProgress}>
                    <div className={styles.filenamesize}>
                        <div className={styles.filename}>{name}</div>
                        <div className={styles.size}>{size}</div>
                    </div>
                    {!isUploaded && <LinearProgressWithLabel value={progress} />}
                </div>
                {isUploaded && <img onClick={() => deleteFunction()} className={styles.fileUploadIcon2} alt="" src="/assets/images/delete.svg" />}
            </div>
        </div>);
};

export default FileUpload;
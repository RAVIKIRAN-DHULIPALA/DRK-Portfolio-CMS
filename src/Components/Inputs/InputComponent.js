import { useState, memo } from "react";
import { TextField, InputAdornment, IconButton, Icon } from '@mui/material';
import styles from "./InputComponent.module.css";

const InputComponent = ({ isLabel, isColor, label, placeholder, isLink, type, name, register, error, value, change, change1, index, defaultValue, params, isAuto }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className={styles.inputcomponent}>
      {isLabel && <p className={styles.label}>{label}</p>}
      <TextField size="medium"
        required={true}
        fullWidth={true}
        margin="none"
        defaultValue={defaultValue}
        {...params}
        InputProps={type == "password" ? {
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleShowPasswordClick}
                aria-label="toggle password visibility"
              >
                <Icon>
                  {showPassword ? "visibility_off" : "visibility"}
                </Icon>
              </IconButton>
            </InputAdornment>
          ),
        } : (isColor || isLink) ? {
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <div className={styles.addOn}>
                <div className={styles.text24}>{isColor ? "Hex(#) or var" : "https://"}</div>
              </div>
            </InputAdornment>
          )
        } : isAuto ? { ...params?.InputProps, readOnly: true, disableUnderline: true } : { disableUnderline: true }}
        name={name}
        multiline={type === "multiline" ? true : false}
        rows={type === "multiline" ? 3 : 1}
        error={error}
        value={value}
        onChange={(event) => { isColor ? (change(event)) : change(event, index) }}
        helperText={error ? "Incorrect password" : ""}
        className={!isLabel ? styles.inputContainer : styles.inputContainer1} placeholder={placeholder} type={(type == "password" && showPassword) ? "text" : type} variant="standard" {...register} />
    </div>
  );
};

export default InputComponent;

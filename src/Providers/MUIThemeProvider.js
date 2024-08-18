import { createTheme } from '@mui/material/styles';

const MUIThemeProvider = () => {
    const customTheme = () =>
        createTheme({
            typography: {
                fontFamily: 'var(--text-md-regular)',
                body1: {
                    fontSize: "var(--text-md-medium-size) !important",
                    color: "var(--gray-900) !important",
                    fontWeight: "400 !important",
                    lineHeight: "24px !important"
                }
            },
            components: {
                MuiButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: "var(--br-5xs) !important",
                            textTransform: "none !important",
                            width: "100% !important",
                            padding: "var(--padding-3xs) var(--padding-lg) !important"
                        }
                    }
                },
                MuiTextField: {
                    styleOverrides: {
                        root: {
                            width: "auto !important"
                        }
                    }
                },
                MuiPaper: {
                    styleOverrides: {
                        root: {
                            borderRadius: "var(--br-5xs) !important"
                        }
                    }
                },
                MuiFormControlLabel: {
                    styleOverrides: {
                        root: {
                            fontSize: "var(--text-sm-medium-size) !important",
                            marginLeft: "0px"
                        }
                    }
                },
                MuiInput: {
                    styleOverrides: {
                        root: {
                            border: "none",
                            "& .MuiInputBase-root:after": {
                                border: "none"
                            },
                            "& .MuiInputBase-root:before": {
                                border: "none"
                            }
                        }
                    }
                },
                MuiCheckbox: {
                    styleOverrides: {
                        root: {
                            color: "var(--gray-300)",
                            "& .MuiSvgIcon-root": {
                                strokeWidth: "1px"
                            }

                        }
                    }
                }
            }

        });
    return customTheme;
}

export default MUIThemeProvider;
import { memo, useEffect, useState } from "react";
import styles from "./AIHelper.module.css";
import InputComponent from "../Inputs/InputComponent";
import { LoadingButton } from "@mui/lab";
import GeneratedContentItem from "./GeneratedContentItem";

const AIHelper = memo(({ onClose, formdata, setFormData, setState }) => {
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
    const [loading, setLoading] = useState(false);
    const [predictData, setPredictData] = useState([]);
    const [prompt, setPrompt] = useState("");
    const callPredict = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(sessionStorage.getItem("user"));

            const token = user.stsTokenManager.accessToken;
            if (prompt === "") {
                alert("prompt cannot be empty")
            }
            else {
                // Call the secured Cloud Function
                await fetch('https://us-central1-drk-ux-portfolio.cloudfunctions.net/secureTextPredictor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        inputText: prompt,
                    }),
                }).then(async (response) => {
                    if (!response.ok) {
                        throw new Error('Function call failed');
                    }

                    await response.json().then((res) => {
                        setPredictData(res.data);
                        setLoading(false);
                    });

                });
            }


        } catch (e) { }
        return
    }
    const handlePromptChange = (event) => {
        let data = event.target.value;
        setPrompt(data);
    }
    return (
        <div className={styles.aiHelper} data-animate-on-scroll>
            <div className={styles.slideOutMenuHeader}>
                <div className={styles.content}>
                    <div className={styles.slideOutHeading}>AI helper</div>
                </div>
                <button className={styles.closeButton} onClick={onClose}>
                    <div className={styles.buttonBase}>
                        <img className={styles.xIcon} alt="" src="/assets/images/close.svg" />
                    </div>
                </button>
            </div>
            <div className={styles.mainContent}>
                <form className={styles.mainForm}>
                    <InputComponent label={"Prompt"} type={"multiline"}
                        change={(event) => handlePromptChange(event)}
                        placeholder={"Enter your prompt here..."} isLabel={true} />
                    <div className={styles.dividerAndGenerate}>
                        <LoadingButton
                            className={styles.generateButton}
                            variant="contained"
                            fullWidth
                            type="submit"
                            size="large"
                            loading={loading}
                            loadingIndicator="Generating..."
                            disableElevation
                            onClick={() => callPredict()}
                        >Generate</LoadingButton>
                        <div className={styles.divider} />
                    </div>
                </form>
                <div className={styles.generatedContent} >
                    {predictData.map((ele, index) => {
                        return <GeneratedContentItem text={ele.structValue.fields.content.stringValue} index={index + 1} formdata={formdata} setFormData={setFormData} setState={setState} />
                    })}
                </div>
            </div>
        </div>
    );
});

export default AIHelper;

import { useEffect, useState } from "react";
import styles from "./LogIn.module.css";
import InputComponent from "../../Components/Inputs/InputComponent";
import { createApi } from 'unsplash-js';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import Warning from "../../Components/states/Warning";
import { auth, signInWithEmailAndPassword } from "../../Firebase-utils/config";


const LogIn = () => {
  //variable and setStates

  const [quoteData, setQuoteData] = useState([
    {
      "photoUrl": "",
      "quote": "",
      "author": ""
    }
  ])
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);
  const [errorDivContent, setErrorDivContent] = useState("");

  //fetching image from unsplash and quote on Render of page.
  useEffect(() => {
    let data = [...quoteData];
    const unsplash = createApi({
      accessKey: 'g4up6EPnEbgY0OX_HgWjIsCgyeKr65cQ2-x0dAapRvQ',
    });
    unsplash.photos.getRandom({ query: 'portfolio-background', count: 1, orientation: "portrait" }).then(result => {
      if (result.errors) {
        // handle error here
        console.log('error occurred: ', result.errors[0]);
      } else {
        // handle success here
        const photo = result.response;
        data[0]["photoUrl"] = photo[0].urls.full;
      }
    }).catch((er) => {
      console.log(er)
    })

    //getting the quote from quotable.io
    fetch("https://api.quotable.io/quotes/random?tags=inspirational&limit=1")
      .then(response => response.json())
      .then(result => {
        data[0]["quote"] = result[0].content;
        data[0]["author"] = result[0].author;
        setQuoteData(data);
      })
      .catch(error => console.log('error', error));

  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submit = (data) => {
    setLoading(true);
    let email = data.username;
    let password = data.password;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        sessionStorage.setItem("user", JSON.stringify(user));
        navigate("/skills-section/ux-case-studies", { replace: true });
        setLoading(false);
        // ...
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.code)
        if (error.code == "auth/user-not-found") {
          setVisible(true);
          setErrorDivContent(
            "You don't have access to proceed. Please contact Admin."
          );
        } else if (error.code == "auth/wrong-password") {
          setError(true);
        }
        else if (error.code == "auth/invalid-login-credentials") {
          setVisible(true);
          setErrorDivContent(
            "Credentials you provided are incorrect. Please try with correct one's."
          );
        }
      });
  }

  return (
    <div className={styles.logIn}>
      <section className={styles.leftSection}>
        <header className={styles.logoHeader}>
          <div className={styles.logo}>
            <img className={styles.logoRk1Icon} alt="" src="/assets/images/logork-1.svg" />
            <img className={styles.logo2Icon} alt="" src="/assets/images/logo-2.svg" />
          </div>
        </header>
        <div className={styles.mainFormContainer}>
          <div className={styles.mainFormContent}>
            <div className={styles.mainFormHeadingsubtext}>
              <h2 className={styles.text}>Login</h2>
              <p className={styles.supportingText}>
                Welcome back! Please enter your details.
              </p>
            </div>
            {visible ? <Warning text={errorDivContent} /> : ""}
            <form className={styles.mainForm} onSubmit={handleSubmit(submit)}>
              <InputComponent name="email"
                label="Username/Email" type="email" placeholder="Enter your username/email here" register={register("username")} />
              <InputComponent label="Password" type="password" name="password" placeholder="Enter your password here" error={error} register={register("password")} />
              {/* <div className={styles.rememberforgotPassowordRow}>
                <a className={styles.forgotPasswordLink}>
                  <div className={styles.forgotPasswordText}>
                    Forgot password?
                  </div>
                </a>
              </div> */}
              <LoadingButton
                className={styles.signinButton}
                variant="contained"
                fullWidth
                type="submit"
                size="large"
                loading={loading}
                loadingIndicator="Signing in ..."
                disableElevation
              >
                Sign in
              </LoadingButton>
            </form>
          </div>
        </div>
        <footer className={styles.footer}>
          <p className={styles.copyrightText}>© Ravikiran Dhulipala 2023</p>
        </footer>
      </section>
      <section className={styles.section} style={{ backgroundImage: `url(${quoteData[0].photoUrl})` }}>
        <img
          className={styles.linePatternIcon}
          loading="eager"
          alt=""
          src="/assets/images/line-pattern.svg"
        />
        <div className={styles.quoteContainer}>
          <div className={styles.quoteContent}>
            <h1 className={styles.quote}>
              “{quoteData[0].quote}”
            </h1>
            <p className={styles.author}>- {quoteData[0].author}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LogIn;

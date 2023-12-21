import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import Button from "../../UI/Buttons/Button";
import styles from "./LoginModal.module.css";

import { defaultUserLogo } from "../../../fileUrls";
import { AppContext } from "../../../AppContext.js";

async function sendEmailVerificationOtp(userEmail) {
    const data = {
        email: userEmail,
        otpType: "emailVerification",
    };

    try {
        const url = `${window.location.protocol}//${window.location.hostname}:4000/api/auth/resend-otp`;
        const response = await axios.post(url, data);
        return response.data.code;
    } catch (error) {
        return error.response.data.code;
    }
}

const LoginModal = () => {
    const { context, setContext } = useContext(AppContext);

    /** To store the user login email id */
    const [email, setEmail] = useState("");

    /** To store the user login password */
    const [password, setPassword] = useState("");

    /** To store if the user is admin or not */
    const [isAdmin, setIsAdmin] = useState(false);

    /** To store the login message to be displayed to user */
    const [loginMessage, setLoginMessage] = useState("");

    /** To store the email validation message */
    const [emailErrorClass, setEmailErrorClass] = useState("");

    /** User email id validation */
    useEffect(() => {
        /** RFC 2822 standard email validation regualr expression string */
        if (email !== "") {
            // eslint-disable-next-line
            var mailRegex =
                /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
            email.match(mailRegex)
                ? setEmailErrorClass("")
                : setEmailErrorClass("error");
        } else {
            setEmailErrorClass("");
        }
    }, [email]);

    /** Function to handle things when user clicks the SUBMIT button in login form */
    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if (emailErrorClass !== "") {
            setLoginMessage("Please enter a valid email");
            return;
        }

        /** Request body data */
        const data = {
            email: email,
            password: password,
            isAdmin: isAdmin.toString(),
        };

        try {
            const url = `${window.location.protocol}//${window.location.hostname}:4000/api/auth/login`;
            const response = await axios.post(url, data);
            if (response.status === 200) {
                setLoginMessage("Login Successful");

                /** Store the refresh token */
                const refreshToken = response.data.data.refreshToken;
                localStorage.setItem("refreshToken", refreshToken);

                /** Wait for 2 seconds and then close the login modal */
                setTimeout(() => {
                    setContext({
                        ...context,
                        isLoggedIn: true,
                        isLoginModalOpen: false,
                        isUserAdmin: isAdmin,
                        userEmail: email,
                        userId: response.data.data.userId,
                    });
                }, 2000);
            } else if (response.status === 202) {
                setLoginMessage("Please verify your email id first");
                const status = await sendEmailVerificationOtp(email);
                if (status === 200) {
                    console.log("Email verification OTP sent");
                    setContext({
                        ...context,
                        isLoggedIn: false,
                        isUserAdmin: isAdmin,
                        userEmail: email,
                        userId: response.data.data.userId,
                        isOtpModalOpen: true,
                        isLoginModalOpen: false,
                    });
                }
            }
        } catch (error) {
            const errorMessage = error.response.data.error.message;
            setLoginMessage(errorMessage.toUpperCase());
        }
    };

    const handleModalClose = () => {
        setContext({ ...context, isLoginModalOpen: false });
    };

    const handlePasswordReset = () => {
        setContext({
            ...context,
            isForgotPasswordModalOpen: true,
            isLoginModalOpen: false,
        });
    };
    return (
        <div className={styles.modal}>
            <div className={styles.modal_content}>
                <Button
                    className={styles.close_btn}
                    onClick={() => handleModalClose()}
                >
                    &times;
                </Button>
                <img
                    src={defaultUserLogo}
                    className={styles.login_image}
                    alt="dummy img"
                />

                <div className={styles.form_content}>
                    <form
                        className={styles.login_form}
                        onSubmit={handleLoginSubmit}
                    >
                        <div className={styles.input_field}>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                className={emailErrorClass ? styles.error : ""}
                                onChange={(e) => setEmail(e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className={styles.input_field}>
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required={true}
                            />
                        </div>

                        <div
                            className={`${styles.input_field} ${styles.checkbox}`}
                        >
                            <label>Login as Administrator</label>
                            <input
                                type="checkbox"
                                name="isAdmin"
                                value={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            />
                        </div>
                        <Button className="login-btn" type="submit">
                            Login
                        </Button>
                    </form>

                    <div className={styles.forgot_password}>
                        <p onClick={() => handlePasswordReset()}>
                            {/*eslint-disable-next-line*/}
                            Forgot Password? <a href="#">Reset Now</a>{" "}
                        </p>
                    </div>
                    <div className={styles.message}>{loginMessage}</div>
                </div>
            </div>
        </div>
    );
};
export default LoginModal;

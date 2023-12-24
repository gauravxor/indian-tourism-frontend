import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import Button from "../../UI/Buttons/Button";
import { AppContext } from "../../../AppContext.js";

import styles from "./OtpModal.module.css";

const OtpModal = () => {
    const { context, setContext } = useContext(AppContext);

    /** To store the OTP entered by user */
    const [otp, setOtp] = useState("");

    /** To store the OTP expiry timer value */
    const [timer, setTimer] = useState(120);

    /** To store the verification message to be displayed to user */
    const [infoMessage, setInfoMessage] = useState("");

    const [actionBtnText, setActionButtonText] = useState("Submit OTP");

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    /** Function to handle OTP modal close button click */
    const handleModalClose = () => {
        if (context.isVerified === true) {
            console.log("OTP Modal Closed");
            setContext({ ...context, isOtpModalOpen: false });
        } else {
            console.log("First verify the email id");
            setInfoMessage("First verify the email id");
        }
    };

    /** Function to handle things when user clicks the SUBMIT button in OTP form */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitDisabled(true);

        /** If submit button is clicked when the OTP has expired */
        if (timer === 0) {
            resendOtp();
            return;
        }
        const data = {
            email: context.userEmail,
            otp: otp,
            otpType: "emailVerification",
        };

        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/api/auth/verify-otp`;
            const response = await axios.post(url, data, {
                withCredentials: true,
            });
            if (response.data.code === 200) {
                console.log("OTP verified");
                setInfoMessage("Email verified");
                setIsSubmitDisabled(false);

                /** Set the refresh token */
                const refreshToken = response.data.data.refreshToken;
                localStorage.setItem("refreshToken", refreshToken);

                /** Wait for 2 seconds and then close the OTP modal */
                setTimeout(() => {
                    setContext({
                        ...context,
                        isLoggedIn: true,
                        isLoginModalOpen: false,
                        isOtpModalOpen: false,
                        isVerified: true,
                        isUserAdmin: false,
                    });
                }, 2000);
            }
        } catch (error) {
            const errorMessage = error.response.data.error.message;
            setInfoMessage(errorMessage.toUpperCase());
            setIsSubmitDisabled(false);
        }
    };

    const resendOtp = async () => {
        const data = {
            email: context.userEmail,
            otpType: "emailVerification",
        };
        const url = `${process.env.REACT_APP_API_BASE_URL}/api/auth/resend-otp`;

        try {
            const response = await axios.post(url, data, {
                withCredentials: true,
            });
            if (response.data.code === 200) {
                setInfoMessage("New OTP sent");
                setTimer(120);
                setIsSubmitDisabled(false);
                setActionButtonText("Submit OTP");
            }
        } catch (error) {
            setInfoMessage(error.response.data.error.message.toUpperCase());
            setIsSubmitDisabled(false);
        }
    };

    /** Function to handle the OTP expiry timer */
    const handleCountdown = () => {
        if (timer > 0) {
            const interval = setTimeout(() => {
                setTimer(timer - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setActionButtonText("Resend OTP");
        }
    };

    useEffect(() => {
        handleCountdown();
    }, [timer]); // eslint-disable-line

    /** Clear the verification message after 2 seconds */
    useEffect(() => {
        if (infoMessage !== "") {
            const interval = setInterval(() => {
                setInfoMessage("");
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [infoMessage]);

    return (
        <div className={styles.modal}>
            <div className={styles.modal_content}>
                <div className={styles.modal_header}>
                    <h1 className={styles.modal_header_text}>Verify Email</h1>
                    <Button
                        className={styles.close_btn}
                        onClick={() => handleModalClose()}
                    >
                        &times;
                    </Button>
                </div>

                <form className={styles.otp_form} onSubmit={handleFormSubmit}>
                    <div className={styles.input_field}>
                        <label htmlFor="otp">
                            Enter OTP sent to your email
                        </label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            placeholder={
                                timer !== 0
                                    ? `OTP Expires in  ${timer}`
                                    : "OTP expired"
                            }
                            value={timer !== 0 ? otp : ""}
                            onChange={(e) => setOtp(e.target.value)}
                            required={true}
                            disabled={timer === 0 ? true : false}
                        />
                    </div>
                    <Button
                        type="submit"
                        className={styles.action_btn}
                        disabled={isSubmitDisabled}
                    >
                        {actionBtnText}
                    </Button>
                </form>
                <div className={styles.modal_footer}>
                    <p> {infoMessage} </p>
                </div>
            </div>
        </div>
    );
};
export default OtpModal;

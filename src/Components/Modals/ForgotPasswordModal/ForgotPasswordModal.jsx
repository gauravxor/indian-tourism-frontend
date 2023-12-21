import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import { AppContext } from "../../../AppContext.js";

import Button from "../../UI/Buttons/Button";
import styles from "./ForgotPasswordModal.module.css";

const ForgotPasswordModal = () => {
    const { context, setContext } = useContext(AppContext);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetId, setResetId] = useState(0);

    const [resetMessage, setResetMessage] = useState("");
    const [actionBtnText, setActionBtnText] = useState("Send OTP");
    const [otpTimer, setOtpTimer] = useState(0);

    const [isMailSent, setIsMailSent] = useState(false);
    const [isOtpValidated, setIsOtpValidated] = useState(false);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    /** Function to handle things when user clicks FORGOT PASSWORD button */
    const sendOtp = async (event) => {
        event.preventDefault();
        setIsSubmitDisabled(true);

        const data = { email };
        try {
            const url = `${window.location.protocol}//${window.location.hostname}:4000/api/auth/forgot-password`;
            const response = await axios.post(url, data);
            if (response.data.code === 200) {
                setResetMessage("OTP sent to registered email");
                /** Wait for 2 seconds before rendering the other component */
                setTimeout(() => {
                    setIsMailSent(true);
                    setIsSubmitDisabled(false);
                    setActionBtnText("Submit OTP");
                    setOtpTimer(120);
                }, 3000);
            }
        } catch (error) {
            setIsSubmitDisabled(false);
            if (error.response.data.code === 500) {
                setResetMessage("Server error. Please try again later");
            } else {
                setResetMessage(
                    error.response.data.error.message.toUpperCase()
                );
            }
        }
    };

    /** Function to be executed when user submits an OTP */
    const submitOtp = async (event) => {
        event.preventDefault();
        setIsSubmitDisabled(true);
        const data = {
            email: email,
            otp: otp,
            otpType: "passwordReset",
        };

        try {
            const url = `${window.location.protocol}//${window.location.hostname}:4000/api/auth/verify-otp`;
            const response = await axios.post(url, data);

            if (response.data.code === 200) {
                /** Setting the appropriate message to user's click action */
                setOtpTimer(0);
                setResetMessage("OTP validated");
                setResetId(response.data.data.resetId);

                /** Wait for 2 seconds before rendering the other component */
                setTimeout(() => {
                    setIsSubmitDisabled(false);
                    setActionBtnText("Change Password");
                    setIsOtpValidated(true);
                }, 2000);
            }
        } catch (error) {
            setIsSubmitDisabled(false);
            setResetMessage(error.response.data.error.message.toUpperCase());
        }
    };

    const submitPassword = async (event) => {
        event.preventDefault();
        setIsSubmitDisabled(true);
        const data = {
            email: email,
            newPassword: password,
            resetId,
        };

        try {
            const url = `${window.location.protocol}//${window.location.hostname}:4000/api/auth/change-password`;
            const response = await axios.post(url, data);

            if (response.data.code === 200) {
                setResetMessage("Password reset successful. Login to continue");

                /** Wait for 3 seconds before rendering the other component */
                setTimeout(() => {
                    setIsSubmitDisabled(false);
                    setContext({
                        ...context,
                        isForgotPasswordModalOpen: false,
                        isLoginModalOpen: false,
                    });
                }, 3000);
            }
        } catch (error) {
            setIsSubmitDisabled(false);
            setResetMessage("Error setting new password");
        }
    };

    const resendOtp = async (event) => {
        event.preventDefault();
        setIsSubmitDisabled(true);
        const data = {
            email: email,
            otpType: "passwordReset",
        };

        try {
            const url = `${window.location.protocol}//${window.location.hostname}:4000/api/auth/resend-otp`;
            const response = await axios.post(url, data);

            if (response.data.code === 200) {
                setIsSubmitDisabled(false);
                setActionBtnText("Submit OTP");
                setResetMessage("New OTP sent. Please check your email");
                setTimeout(() => {
                    setOtpTimer(120);
                }, 3000);
            }
        } catch (error) {
            setIsSubmitDisabled(false);
            setOtpTimer(0);
            setResetMessage("Error resending OTP");
        }
    };

    const handleModalClose = async () => {
        console.log("Forgot password Modal Closed");
        setContext({
            ...context,
            isForgotPasswordModalOpen: false,
            isLoginModalOpen: false,
        });
    };

    /** Function to clear reset message in 2 seconds after it is displayed */
    useEffect(() => {
        if (resetMessage !== "") {
            const timeout = setTimeout(() => {
                setResetMessage("");
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [resetMessage]);

    /** Handling OTP Expiry timer */
    useEffect(() => {
        if (otpTimer > 0) {
            const timeout = setTimeout(() => {
                setOtpTimer(otpTimer - 1);
            }, 1000);
            return () => clearTimeout(timeout);
        } else if (isMailSent && !isOtpValidated && otpTimer === 0) {
            setActionBtnText("Resend OTP");
        }
    }, [otpTimer, isMailSent, isOtpValidated]);

    const renderSubmitButton = (x) => {
        return (
            <Button
                type="submit"
                className={styles.action_btn}
                disabled={isSubmitDisabled}
            >
                {actionBtnText}
            </Button>
        );
    };

    const renderForm = () => {
        if (!isMailSent && !isOtpValidated) {
            return (
                <form className={styles.reset_form} onSubmit={sendOtp}>
                    <div className={styles.input_field}>
                        <label htmlFor="email">
                            Enter your registered email{" "}
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={email}
                            placeholder="Enter your registered email"
                            onChange={(e) => setEmail(e.target.value)}
                            required={true}
                        />
                    </div>
                    {renderSubmitButton()}
                </form>
            );
        }

        if (isMailSent && !isOtpValidated) {
            return (
                <form
                    className={styles.reset_form}
                    onSubmit={otpTimer !== 0 ? submitOtp : resendOtp}
                >
                    <div className={styles.input_field}>
                        <label htmlFor="otp"> Enter the OTP </label>
                        <input
                            id="otp"
                            type="text"
                            name="otp"
                            value={otp}
                            placeholder={!otpTimer || "Type the OTP here"}
                            onChange={(e) => setOtp(e.target.value)}
                            required={true}
                            disabled={otpTimer === 0}
                        />
                    </div>
                    {renderSubmitButton()}
                    <div className={styles.timer_container}>
                        {otpTimer !== 0 ? (
                            <p>OTP Expires in {otpTimer} seconds</p>
                        ) : (
                            <p>OTP expired</p>
                        )}
                    </div>
                </form>
            );
        }

        if (isOtpValidated && isMailSent) {
            return (
                <form className={styles.reset_form} onSubmit={submitPassword}>
                    <div className={styles.input_field}>
                        <label htmlFor="password">New Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={password}
                            placeholder="Enter your new password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.input_field}>
                        <label htmlFor="confirm_password">
                            Confirm Password
                        </label>
                        <input
                            id="confirm_password"
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            placeholder="Confirm your new password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required={true}
                        />
                    </div>
                    {renderSubmitButton()}
                </form>
            );
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modal_content}>
                {/* Modal header. Contains heading and modal close button */}
                <div className={styles.modal_header}>
                    <h1 className={styles.modal_header_text}>Password Reset</h1>
                    <Button
                        className={styles.close_btn}
                        onClick={() => handleModalClose()}
                    >
                        &times;
                    </Button>
                </div>
                {renderForm()}
                <div className={styles.modal_footer}>
                    <p> {resetMessage} </p>
                </div>
            </div>
        </div>
    );
};
export default ForgotPasswordModal;

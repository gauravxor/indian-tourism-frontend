import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import Button from "../../UI/Buttons/Button";
import { AppContext } from "../../../AppContext.js";

import styles from "./SignUpModal.module.css";

const SignUpModal = () => {
    const { context, setContext } = useContext(AppContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [country, setCountry] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const [passwordError, setPasswordError] = useState("");
    const [confirmPassError, setConfirmPassError] = useState("");
    const [emailError, setEmailError] = useState("");

    const [signUpMessage, setSignUpMessage] = useState("");
    const [inputType, setInputType] = useState("");
    const [timeoutId, setTimeoutId] = useState(null);

    /** User password validation */
    useEffect(() => {
        if (password !== "" && password.length < 8) {
            setPasswordError("Password should contain minimum 8 characters");
        } else {
            setPasswordError("");
        }

        if (password !== "" && passwordError === "" && confirmPass !== "") {
            setConfirmPassError(
                confirmPass !== password ? "Passwords do not match" : ""
            );
        }
    }, [password, passwordError, confirmPass]);

    /** User email validation */
    useEffect(() => {
        /** RFC 2822 standard email validation regualr expression string */
        // eslint-disable-next-line
        var mailFormat =
            /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

        if (email !== "") {
            email.match(mailFormat)
                ? setEmailError("")
                : setEmailError("Invalid Email");
        } else {
            setEmailError("");
        }
    }, [email]);

    /** Clear the signup message */
    useEffect(() => {
        if (signUpMessage !== "") {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
            const tid = setTimeout(() => {
                setSignUpMessage("");
            }, 3000);
            setTimeoutId(tid);
        }
    }, [signUpMessage]); // eslint-disable-line

    /** Function to handle modal close click */
    const handleModalClose = () => {
        setContext({ ...context, isSignUpModalOpen: false });
    };

    function handleFocus() {
        setInputType("date");
    }
    function handleBlur() {
        setInputType("text");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (
            passwordError !== "" ||
            confirmPassError !== "" ||
            emailError !== ""
        ) {
            setSignUpMessage("Fill the form correctly!");
        } else {
            console.log("Sign up form submitted");
            const data = {
                name: {
                    firstName: firstName,
                    lastName: lastName,
                },
                contact: {
                    email: email,
                },
                password: password,
                address: {
                    country: country,
                },
                ...(dob !== "" && { dob: dob }),
            };

            setSignUpMessage("Signing Up...");
            try {
                const url = `${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`;
                const response = await axios.post(url, data, {
                    withCredentials: true,
                });
                if (response.status === 201) {
                    setSignUpMessage("Signed Up Successfully!");

                    /** Wait for 2 seconds and then close the signup modal and show OTP modal */
                    setTimeout(() => {
                        setContext({
                            ...context,
                            isLoggenIn: false,
                            isSignUpModalOpen: false,
                            isOtpModalOpen: true,
                            userEmail: email,
                            userId: response.data.data.userId,
                        });
                    }, 2000);
                }
            } catch (error) {
                const response = error.response.data;
                setSignUpMessage(response.error.message.toUpperCase());
            }
        }
    }

    return (
        <div className={styles.modal}>
            <div className={styles.modal_content}>
                <div className={styles.modal_header}>
                    <h1 className={styles.modal_header_text}>Sign Up</h1>
                    <Button
                        className={styles.modal_header_button}
                        onClick={() => handleModalClose()}
                    >
                        &times;
                    </Button>
                </div>
                <form
                    className={styles.modal_form_body}
                    onSubmit={handleSubmit}
                >
                    <div className={styles.name_input_container}>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required={true}
                        />
                        <input
                            type="text"
                            name="Last Name"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required={true}
                        />
                    </div>
                    <div className={styles.others_input_container}>
                        <input
                            type={inputType}
                            name="dob"
                            placeholder="DOB (Opt.)"
                            value={dob}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setDob(e.target.value)}
                        />
                        <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required={true}
                        />
                    </div>
                    <div className={styles.cred_input_container}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required={true}
                        />
                        <div className={styles.error_container}>
                            {emailError}
                        </div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={true}
                        />
                        <div className={styles.error_container}>
                            {passwordError}
                        </div>
                        <input
                            type="password"
                            name="conf-password"
                            placeholder="Confirm password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            required={true}
                            disabled={password === "" || passwordError !== ""}
                        />
                        <div className={styles.error_container}>
                            {confirmPassError}
                        </div>
                    </div>
                    <Button type="submit" className={styles.signup_btn}>
                        {signUpMessage === "" ? "Sign Up" : signUpMessage}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default SignUpModal;

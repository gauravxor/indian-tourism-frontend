import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import UserProfileEdit from "./UserProfileEdit.jsx";
import { AppContext } from "../../../AppContext.js";
import styles from "./UserProfile.module.css";
import Button from "../../UI/Buttons/Button.jsx";

const getDayOfMonthSuffix = (dayOfMonth) => {
    if (dayOfMonth >= 11 && dayOfMonth <= 13) {
        return "th";
    }
    switch (dayOfMonth % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
};
const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    const dayOfMonth = date.getDate();
    const suffix = getDayOfMonthSuffix(dayOfMonth);
    const finalResult = `${dayOfMonth}${suffix} ${formattedDate}`;
    return finalResult;
};

async function getUserData(userId) {
    const url = `${window.location.protocol}//${window.location.hostname}:4000/api/user/details/${userId}`;
    try {
        const response = await axios.get(url, { withCredentials: true });
        return response.data.data.userData;
    } catch (error) {
        if (error.response.status === 401) {
            return "unauthorized";
        } else {
            console.log(`User with id ${userId} not found`);
        }
    }
}

const UserProfile = () => {
    const { context, resetContext } = useContext(AppContext);

    const [userDetails, setUserDetails] = useState({});

    /** If user want to edit their profile */
    const [inEditableMode, setInEditableMode] = useState(false);

    useEffect(() => {
        if (context.userId !== "") {
            getUserData(context.userId).then((userData) => {
                if (userData === "unauthorized") {
                    resetContext();
                } else {
                    if (!userData.userImageURL.includes("imgur")) {
                        userData.userImageURL = `${window.location.protocol}//${window.location.hostname}:4000${userData.userImageURL}`;
                    }
                    setUserDetails(userData);
                }
            });
        }
    }, [context.userId]);

    /** If userId is empty in context, then the user is not logged in, hence display appropriate message */
    if (context.userId === "") {
        return (
            <div>
                <h1> You must be logged in to view this page </h1>
            </div>
        );
    } else if (userDetails !== null && Object.keys(userDetails).length !== 0) {
        /** If userDetails are fetched, render the component */
        return (
            <>
                {/* If the state of inEditableMode is false, then display the user details, else display the edit form */}
                {!inEditableMode ? (
                    <div className={styles.user_details}>
                        <div className={styles.user_image}>
                            <img
                                src={userDetails.userImageURL}
                                alt="User-profile"
                            />
                        </div>
                        <div className={styles.user_info}>
                            <div className={styles.name}>
                                {userDetails.name.firstName}{" "}
                                {userDetails.name.middleName}{" "}
                                {userDetails.name.lastName}
                            </div>
                            <div className={styles.contact}>
                                📱 <b>Phone :</b> {userDetails.contact.phone}{" "}
                                <br />
                                📧 <b>Email :</b> {userDetails.contact.email}
                            </div>
                            <div className={styles.address}>
                                🏠 <b>Address :</b>{" "}
                                {userDetails.address.addressMain},{" "}
                                {userDetails.address.city},{" "}
                                {userDetails.address.state},{" "}
                                {userDetails.address.country} -{" "}
                                {userDetails.address.pincode}
                            </div>
                            <div className={styles.additional_info}>
                                {!context.isUserAdmin && (
                                    <div>
                                        📫 <b>Email Verified :</b>{" "}
                                        {userDetails.isEmailVerified
                                            ? "Yes ✅"
                                            : "No ❌"}
                                    </div>
                                )}
                                {!context.isUserAdmin && (
                                    <div>
                                        💰 <b>Wallet Balance :</b> Rs.{" "}
                                        {userDetails.walletBalance}
                                    </div>
                                )}
                                <div>
                                    🎂 <b>Date of Birth :</b>{" "}
                                    {formatDate(userDetails.dob)}
                                </div>
                                {!context.isUserAdmin && (
                                    <div>
                                        🔖 <b>Total Bookings :</b>{" "}
                                        {userDetails.bookingCount}
                                    </div>
                                )}
                                {context.isuserAdmin && (
                                    <div>
                                        🌏 <b>Total Locations :</b>{" "}
                                        {userDetails.locationCount}{" "}
                                    </div>
                                )}
                            </div>
                            <Button
                                className={styles.edit_btn}
                                onClick={() => setInEditableMode(true)}
                            >
                                Edit
                            </Button>
                        </div>
                    </div>
                ) : (
                    /** Displaying the edit form */
                    <UserProfileEdit
                        userDetails={userDetails}
                        setInEditableMode={setInEditableMode}
                    />
                )}
            </>
        );
    }
};

export default UserProfile;

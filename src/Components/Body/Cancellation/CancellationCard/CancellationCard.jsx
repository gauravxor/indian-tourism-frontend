import React from "react";
import axios from "axios";
import styles from "./CancellationCard.module.css";
import classes from "../../../UI/Buttons/Button.module.css";

const CancellationCard = (props) => {
    /** Storing the cancellationData object */
    const cancellationData = props.cancellationData;

    const cancelApprovalHandler = async () => {
        console.log("Approve button clicked");

        const data = {
            bookingId: cancellationData.bookingId,
            adminId: cancellationData.adminId,
        };

        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/api/book/cancel/approve`;

            /** Calling the cancellation API to approve cancellation */
            const response = await axios.post(url, data, {
                withCredentials: true,
            });
            console.log(response);
            if (response.data.code === 200) {
                alert("Cancellation Approved");
            }
        } catch (error) {
            console.log(error.response.data.error.message.toUpperCase());
        }
    };

    return (
        <div className={styles.cancellation_card}>
            <div className={styles.cancellation_card_header}>
                <h2>{cancellationData.locationName}</h2>
                <p>{cancellationData.locationDesc}</p>
            </div>
            <div className={styles.cancellation_card_details}>
                <div className={styles.cancellation_card_details_row}>
                    <p>
                        <strong>Booking ID:</strong>
                        {cancellationData.bookingId}
                    </p>
                    <p>
                        <strong>Location ID:</strong>
                        {cancellationData.locationId}
                    </p>
                    <p>
                        <strong>Location Name:</strong>
                        {cancellationData.locationName}
                    </p>
                    {/* <p><strong>Admin ID:</strong> {cancellationData.adminId}</p> */}
                    <p>
                        <strong>Usesr ID:</strong> {cancellationData.userId}
                    </p>
                    <p>
                        <strong>User Name:</strong> {cancellationData.userName}
                    </p>
                    <p>
                        <strong>Date of Visit:</strong>
                        {new Date(
                            cancellationData.dateOfVisit
                        ).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Booking Price:</strong> Rs.
                        {cancellationData.bookingPrice}
                    </p>
                </div>
            </div>
            <button
                className={`${props.className} ${classes.button} `}
                type="submit"
                onClick={cancelApprovalHandler}
            >
                Approve
            </button>
        </div>
    );
};

export default CancellationCard;

import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Button from "../../UI/Buttons/Button";
import { AppContext } from "../../../AppContext.js";
import styles from "./PaymentModal.module.css";
import { useNavigate } from "react-router-dom";

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

const PaymentModal = () => {
    const navigate = useNavigate();

    const { context, setContext } = useContext(AppContext);

    /** To store the user payment status message */
    const [paymentMessage, setPaymentMessage] = useState("");

    /** To store the card number entered by user */
    const [cardNumber, setCardNumber] = useState("");

    /** To store booking details */
    const [bookingDetails, setBookingDetails] = useState({});

    const tempBookingId = context.tempBookingId;

    /** Fetch the temporary booking details. As of now this function is not doing anything useful
     * Once payment gateway is implemented in the future, this function will be used to fetch the
     * temporary booking details and display it to the user for confirmation before making the payment
     */
    useEffect(() => {
        const url = `${window.location.protocol}//${window.location.hostname}:4000/api/book/lock/details/${tempBookingId}`;
        axios
            .get(url, { withCredentials: true })
            .then((response) => {
                console.log(response);
                if (response.data.code === 200) {
                    console.log("Booking details fetched successfully");
                    setBookingDetails(response.data.data.bookingData);
                }
            })
            .catch((error) => {
                console.log(error.response.error.message.toUpperCase());
            });
    }, [tempBookingId]);

    /** Function to handle things when user clicks the SUBMIT button in payment modal after entering the card number */
    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        const data = {
            lockId: context.tempBookingId,
            paymentId: "random-payment-id",
        };

        try {
            const url = `${window.location.protocol}//${window.location.hostname}:4000/api/book/final`;
            const response = await axios.post(url, data, {
                withCredentials: true,
            });
            if (response.data.code === 200) {
                console.log("Booking finalised successfully");
                setPaymentMessage("Booking finalised");

                /** Wait for 2 seconds and then close the login modal */
                setTimeout(() => {
                    setContext({
                        ...context,
                        isLoggedIn: true,
                        isPaymentModalOpen: false,
                    });
                    navigate(`/bookings`);
                }, 2000);
            }
        } catch (error) {
            console.log("Error finalizing booking");
            setPaymentMessage("Failed to confirm bookings");
        }
    };

    const handleCancelRequest = () => {
        console.log("Booking cancelled by user");
        setPaymentMessage("Booking cancelled");

        /** Wait for 2 seconds and then close the payment modal */
        setTimeout(() => {
            setContext({
                ...context,
                isLoggedIn: true,
                isPaymentModalOpen: false,
            });
        }, 2000);
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modal_content}>
                <h3 className={styles.modal_header}>Booking Details</h3>
                <div className={styles.modal_info}>
                    <p>
                        <strong>Lock Id:</strong> {bookingDetails.lockId}
                    </p>
                    <p>
                        <strong>Location Name:</strong>{" "}
                        {bookingDetails.locationName}
                    </p>
                    <p>
                        <strong>Total Amount:</strong> Rs.{" "}
                        {bookingDetails.bookingPrice}
                    </p>
                    <p>
                        <strong>No of Tickets:</strong>{" "}
                        {bookingDetails.noOfTickets}
                    </p>
                    <p>
                        <strong>Date of Visit:</strong>{" "}
                        {formatDate(bookingDetails.dateOfVisit)}
                    </p>
                </div>
                <form
                    className={styles.payment_form}
                    onSubmit={handlePaymentSubmit}
                >
                    <div className={styles.form_data}>
                        <label htmlFor="cardnumber">Card Number</label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={cardNumber}
                            id="cardNumber"
                            onChange={(e) => setCardNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.form_buttons}>
                        <Button
                            className="cancel-btn"
                            type="button"
                            onClick={() => handleCancelRequest()}
                        >
                            Cancel
                        </Button>
                        <div className={styles.action_message}>
                            <p> {paymentMessage} </p>
                        </div>
                        <Button
                            className="payment-btn"
                            type="submit"
                            onClick={handlePaymentSubmit}
                        >
                            Pay Now
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default PaymentModal;

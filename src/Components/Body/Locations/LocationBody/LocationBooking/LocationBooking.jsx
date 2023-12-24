// component to show the booking form in the location details page
import React, { useState, useContext } from "react";
import axios from "axios";

import { AppContext } from "../../../../../AppContext.js";
import PaymentModal from "../../../../Modals/PaymentModal/PaymentModal.jsx";
import Button from "../../../../UI/Buttons/Button.jsx";
import DateSelector from "../DateSelector.jsx";
import styles from "./LocationBooking.module.css";

/** This function takes in a date in ISO format and converts it into in DD-MM-YYYY format */
const formattedDate = (visitDate) => {
    const date = new Date(visitDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = day + "-" + month + "-" + year;

    return formattedDate;
};

const LocationBooking = (props) => {
    /** To store the number of adults in tickets */
    const [adultCount, setAdultCount] = useState(1);

    /** To store the number of children in tickets */
    const [childrenCount, setChildrenCount] = useState(0);

    /** To store the visit date */
    const [visitDate, setVisitDate] = useState("");

    /** React state to store the booking message that is to be displayed to user */
    const [bookingMessage, setBookingMessage] = useState("");

    const { context, setContext } = useContext(AppContext);
    const { isPaymentModalOpen } = context;

    /** Function to handle the thing when user submits a booking requesr */
    const handleBookingFormSubmit = async (event) => {
        event.preventDefault();

        /** Calculating the total number of visitors */
        const visitorCount = parseInt(adultCount) + parseInt(childrenCount);
        console.log("Visitor count = " + visitorCount);
        const data = {
            locationId: context.locationId,
            noOfTickets: visitorCount.toString(),
            bookingDate: formattedDate(visitDate),
        };

        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/api/book/lock/`;
            const response = await axios.post(url, data, {
                withCredentials: true,
            });

            if (response.data.code === 200) {
                console.log("Booking lock ID is : " + response.data.lockId);
                setBookingMessage(
                    "Booking locked successfully, proceeding to payment....."
                );

                /** Open the payment modal after 4 seconds */
                setTimeout(() => {
                    setBookingMessage("");
                    setContext({
                        ...context,
                        tempBookingId: response.data.lockId,
                        isPaymentModalOpen: true,
                    });
                }, 4000);
            }
        } catch (error) {
            if (error.response.data.code === 401) {
                setBookingMessage("Please login to book tickets".toUpperCase());
            } else {
                setBookingMessage(error.response.data.error.message);
            }
        }
    };

    useContext(() => {
        console.log("Changes made in booking message");
        if (bookingMessage !== "") {
            const interval = setTimeout(setBookingMessage(""), 3000);
            return () => clearInterval(interval);
        }
    }, [bookingMessage]);

    return (
        <div className={styles.right_section}>
            <h2 className={styles.header}>Booking</h2>

            <form
                className={styles.booking_form}
                onSubmit={handleBookingFormSubmit}
            >
                <div className={styles.input_field}>
                    <label htmlFor="adults">Adult</label>
                    <input
                        type="number"
                        id="adults"
                        name="adults"
                        min="1"
                        max="10"
                        value={adultCount}
                        onChange={(e) => setAdultCount(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.input_field}>
                    <label htmlFor="children">Children</label>
                    <input
                        type="number"
                        id="children"
                        name="children"
                        min="0"
                        max="10"
                        value={childrenCount}
                        onChange={(e) => setChildrenCount(e.target.value)}
                    />
                </div>

                <div className={styles.input_field}>
                    <label htmlFor="date">Visit date</label>
                    <DateSelector
                        visitDate={visitDate}
                        setVisitDate={setVisitDate}
                        locationId={context.locationId}
                    />
                </div>

                <Button type="submit">Book Now</Button>
            </form>
            <p> {bookingMessage}</p>

            {/* If booking lock is successful, then render the payment modal */}
            {isPaymentModalOpen && <PaymentModal />}
        </div>
    );
};

export default LocationBooking;

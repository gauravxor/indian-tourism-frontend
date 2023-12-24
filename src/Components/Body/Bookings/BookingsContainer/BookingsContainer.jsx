import React, { useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import styles from "./BookingsContainer.module.css";
import BookingCard from "../BookingCard/BookingCard.jsx";

import { AppContext } from "../../../../AppContext.js";

function BookingsContainer() {
    const { context } = useContext(AppContext);

    const [bookings, setBookings] = useState([]);

    /** As soon as we have the userId, fetch all the bookings under that UserId */
    useEffect(() => {
        const userId = context.userId;
        console.log("The user id is = " + userId);

        const url = `${process.env.REACT_APP_API_BASE_URL}/api/user/bookings/${userId}`;

        axios
            .get(url, { withCredentials: true })
            .then((response) => {
                console.log("Successfully fetched bookings");
                setBookings(response.data.data.userBookings);
            })
            .catch((error) => {
                console.log(error.response.data.error.message);
            });
    }, [context.userId]);

    return (
        <div className={styles.bookings_card_container}>
            {bookings.map((booking) => (
                <BookingCard key={uuidv4()} bookingData={booking} />
            ))}
        </div>
    );
}

export default BookingsContainer;

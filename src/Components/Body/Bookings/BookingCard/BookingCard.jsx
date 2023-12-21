import axios from "axios";
import styles from "./BookingCard.module.css";
import classes from "../../../UI/Buttons/Button.module.css";

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

const BookingCard = (props) => {
    const { bookingData } = props;

    const bookingId = bookingData.bookingId;
    const cancelBookingHandler = async () => {
        console.log("Sending cancellation request -> " + bookingId);

        try {
            const url = `${window.location.protocol}//${window.location.hostname}:4000/api/book/cancel`;
            const data = {
                bookingId: bookingId,
                userId: bookingData.userId,
            };
            const response = await axios.post(url, data, {
                withCredentials: true,
            });

            if (response.data.code === 200) {
                alert("CANCELLATION REQUEST SUBMITTED");
                window.location.reload();
            }
        } catch (error) {
            alert(error.response.data.error.message.toUpperCase());
        }
    };

    return (
        <div className={styles.booking_card}>
            <div className={styles.booking_card_header}>
                <h2>{bookingData.locationName}</h2>
                <p>{bookingData.locationDesc}</p>
            </div>
            <div className={styles.booking_card_details}>
                <p>
                    <strong>Booking ID:</strong> {bookingData.bookingId}
                </p>
                <p>
                    <strong>User Name:</strong> {bookingData.userName}
                </p>
                <p>
                    <strong>Number of Tickets:</strong>{" "}
                    {bookingData.noOfTickets}
                </p>
                <p>
                    <strong>Date of Visit:</strong>{" "}
                    {formatDate(bookingData.dateOfVisit)}
                </p>
                <p>
                    <strong>Booking Price: Rs. </strong>{" "}
                    {bookingData.bookingPrice}
                </p>
                <p>
                    <strong>Location Address:</strong>{" "}
                    {bookingData.locationAddress.address},{" "}
                    {bookingData.locationAddress.city},{" "}
                    {bookingData.locationAddress.state}{" "}
                    {bookingData.locationAddress.pincode},{" "}
                    {bookingData.locationAddress.country}
                </p>
                {bookingData.cancellationStatus !== "na" && (
                    <p>
                        <strong>Cancellation Status:</strong>{" "}
                        {bookingData.cancellationStatus}
                    </p>
                )}
                {bookingData.isVisited === true && (
                    <p>
                        <strong>Visited :</strong> YES{" "}
                    </p>
                )}
            </div>
            {bookingData.cancellationStatus === "na" &&
                !bookingData.isVisited && (
                    <button
                        className={`${props.className} ${classes.button} `}
                        type="submit"
                        onClick={cancelBookingHandler}
                    >
                        Cancel Booking
                    </button>
                )}
        </div>
    );
};

export default BookingCard;

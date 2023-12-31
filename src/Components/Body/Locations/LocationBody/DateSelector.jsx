import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const DateSelector = (props) => {
    const [disabledDates, setDisabledDates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAvailabilityData = async () => {
            const url = `${process.env.REACT_APP_API_BASE_URL}/api/location/get-availability/${props.locationId}`;
            var availabilityData;
            try {
                const response = await axios.get(url, {
                    withCredentials: true,
                });
                availabilityData =
                    response.data.data.availability.calendarMonths;
            } catch (error) {
                alert("Failed to fetch location availability data");
            }

            var dateCount = 30;
            const disabledDates = [];
            const currentMonth = (new Date().getMonth() + 1).toString();
            const todaysDate = new Date().getDate();

            for (var i = 0; i < availabilityData.length && dateCount; i++) {
                /** Month will have the object where "days" key is an array of dates */
                const month = availabilityData[i];
                if (
                    month.month === currentMonth ||
                    month.month === (parseInt(currentMonth) + 1).toString()
                ) {
                    for (var j = 0; j < month.days.length; j++) {
                        const currentDate = new Date(
                            month.days[j].calendarDate
                        ).getDate();
                        const availableTickets = month.days[j].availableTickets;

                        if (currentDate > todaysDate) {
                            dateCount--;
                            if (availableTickets === 0) {
                                disabledDates.push(
                                    new Date(month.days[j].calendarDate)
                                );
                            }
                        }
                    }
                }
            }
            setDisabledDates(disabledDates);
            setIsLoading(false);
        };
        fetchAvailabilityData();
    }, [props.locationId]);

    console.log(disabledDates);

    if (isLoading) {
        return <div>Loading...</div>;
    } else {
        return (
            <DatePicker
                selected={props.visitDate}
                onChange={(date) => props.setVisitDate(date)}
                minDate={new Date()}
                maxDate={
                    new Date(new Date().setDate(new Date().getDate() + 30))
                }
                excludeDates={disabledDates}
                popperPlacement="bottom-end"
                placeholderText="Choose a date"
                dateFormat="dd/MM/yyyy"
                className="date-selector"
            />
        );
    }
};

export default DateSelector;

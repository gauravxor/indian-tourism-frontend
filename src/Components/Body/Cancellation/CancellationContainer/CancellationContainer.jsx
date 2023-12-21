import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "./CancellationContainer.css";
import CancellationCard from "../CancellationCard/CancellationCard.jsx";
import { AppContext } from "../../../../AppContext.js";

const CancellationContainer = () => {
    // eslint-disable-next-line
    const { context, setContext, resetContext } = useContext(AppContext);

    /** React state to store the array of cancellation data objects */
    const [cancellation, setCancellation] = useState([]);

    /** Fetch the cancellation data as soon as the component is mounted */
    useEffect(() => {
        const url =
            `${window.location.protocol}//${window.location.hostname}:4000/api/book/cancellations/` +
            context.userId;

        axios
            .get(url, { withCredentials: true })
            .then((response) => {
                setCancellation(response.data.data.cancellationData);
            })
            .catch((error) => {
                alert(error.response.data.error.message.toUpperCase());
            });
    }, []); // eslint-disable-line

    return (
        <>
            <div className="cancellation-container">
                {cancellation.map((cancellation) => (
                    <CancellationCard
                        key={uuidv4()}
                        cancellationData={cancellation}
                    />
                ))}
            </div>
        </>
    );
};

export default CancellationContainer;

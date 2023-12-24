import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import ImageCarousel from "./ImageCarousel/ImageCarousel";
import LocationDetails from "./LocationDetails/LocationDetails";
import LocationBooking from "./LocationBooking/LocationBooking";

import styles from "./LocationBody.module.css";
import { AppContext } from "../../../../AppContext";

function LocationBody() {
    const [locationData, setLocationData] = useState({});
    const { context } = useContext(AppContext);
    const { locationId } = useParams();

    useEffect(() => {
        const url = `${process.env.REACT_APP_API_BASE_URL}/api/location/${locationId}`;
        axios
            .get(url)
            .then((response) => {
                setLocationData(response.data.data.locations);
            })
            .catch((error) => {
                console.log("error fetching location data");
            });
    }, [locationId]);

    return (
        <div className={styles.location_body}>
            <div className={styles.location_image}>
                <ImageCarousel imageData={locationData.images} />
            </div>
            <div className={styles.location_rest}>
                <div className={styles.location_details}>
                    <LocationDetails locationData={locationData} />
                </div>
                <div className={styles.location_booking}>
                    <LocationBooking locationId={context.locationId} />
                </div>
            </div>
        </div>
    );
}

export default LocationBody;

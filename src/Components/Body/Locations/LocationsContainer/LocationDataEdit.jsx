import axios from "axios";
import React, { useState, useEffect } from "react";
import styles from "./LocationDataEdit.module.css";
import Button from "../../../UI/Buttons/Button";
const UserProfileEdit = (props) => {
    /** Saving the location id received from props */
    const locationId = props.locationId;

    const [locationData, setLocationData] = useState({});

    useEffect(() => {
        /** Fetching the location details from the API */
        async function fetchLocationDetails() {
            const url =
                `${window.location.protocol}//${window.location.hostname}:4000/api/location/` +
                locationId;
            try {
                const response = await axios.get(url, {
                    withCredentials: true,
                });
                console.log("Fetched location details");
                setLocationData(response.data.data.locations);
            } catch (error) {
                console.log(error);
                console.log(error.response.data.error.message.toUpperCase());
            }
        }
        fetchLocationDetails();
    }, [locationId]);

    /** React states to store the location details */
    const [locationName, setLocationName] = useState("");
    const [locationAddress, setLocationAddress] = useState("");
    const [locationDescription, setLocationDescription] = useState("");
    const [locationCity, setLocationCity] = useState("");
    const [locationState, setLocationState] = useState("");
    const [locationCountry, setLocationCountry] = useState("");
    const [locationPincode, setLocationPincode] = useState("");
    const [locationLongitude, setLocationLongitude] = useState("");
    const [locationLatitude, setLocationLatitude] = useState("");
    const [locationCapacity, setLocationCapacity] = useState("");
    const [locationPrice, setLocationPrice] = useState("");

    const [locationCoverImage1, setLocationCoverImage1] = useState(null);
    const [locationCoverImage2, setLocationCoverImage2] = useState(null);
    const [locationCoverImage3, setLocationCoverImage3] = useState(null);

    const [locationSliderImage1, setLocationSliderImage1] = useState(null);
    const [locationSliderImage2, setLocationSliderImage2] = useState(null);
    const [locationSliderImage3, setLocationSliderImage3] = useState(null);

    /** As soon as location data is fetched, they are initialized with old values for user's ease */
    useEffect(() => {
        setLocationName(locationData.name);
        setLocationAddress(locationData.address);
        setLocationDescription(locationData.description);
        setLocationCity(locationData.city);
        setLocationState(locationData.state);
        setLocationCountry(locationData.country);
        setLocationPincode(locationData.pincode);
        setLocationLongitude(locationData.longitude);
        setLocationLatitude(locationData.latitude);
        setLocationCapacity(locationData.capacity);
        setLocationPrice(locationData.ticketPrice);
    }, [locationData]);

    /** Function to handle operation if user clicks the save button to save the updated location data */
    const handleSave = async (event) => {
        event.preventDefault();

        console.log("Save Location Clicked");

        /** As we are dealing with multipart form data, FormApi is used to create object of data */
        const data = new FormData();
        data.append("name", locationName);
        data.append("description", locationDescription);
        data.append("address", locationAddress);
        data.append("city", locationCity);
        data.append("state", locationState);
        data.append("country", locationCountry);
        data.append("pincode", locationPincode);
        data.append("longitude", locationLongitude);
        data.append("latitude", locationLatitude);
        data.append("capacity", locationCapacity);
        data.append("ticketPrice", locationPrice);
        data.append("cover-image1", locationCoverImage1);
        data.append("cover-image2", locationCoverImage2);
        data.append("cover-image3", locationCoverImage3);
        data.append("slider-image1", locationSliderImage1);
        data.append("slider-image2", locationSliderImage2);
        data.append("slider-image3", locationSliderImage3);

        console.log(data);

        try {
            const url =
                `${window.location.protocol}//${window.location.hostname}:4000/api/location/update-location/` +
                locationId;

            /** Sending out request with appropriate multipart headers */
            const response = await axios.post(url, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
            if (response.data.code === 200) {
                alert("Location Updated Successfully");
            }
        } catch (error) {
            alert(error.response.data.error.message.toUpperCase());
        }
    };

    return (
        <>
            <div className={styles.location_edit_info}>
                <h2>Edit Location</h2>
                <form className={styles.location_data_edit}>
                    <div>
                        <label htmlFor="location-name">Location Name</label>
                        <input
                            type="text"
                            id="location-name"
                            name="location-name"
                            value={locationName}
                            onChange={(event) =>
                                setLocationName(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-description">
                            Description
                        </label>
                        <textarea
                            className={styles.loc_desc}
                            type="text"
                            id="location-description"
                            name="location-description"
                            value={locationDescription}
                            onChange={(event) =>
                                setLocationDescription(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-address">Address</label>
                        <input
                            type="text"
                            id="location-address"
                            name="location-address"
                            value={locationAddress}
                            onChange={(event) =>
                                setLocationAddress(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-city">City</label>
                        <input
                            type="text"
                            id="location-city"
                            name="location-city"
                            value={locationCity}
                            onChange={(event) =>
                                setLocationCity(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-state">State</label>
                        <input
                            type="text"
                            id="location-state"
                            name="location-state"
                            value={locationState}
                            onChange={(event) =>
                                setLocationState(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-country">Country</label>
                        <input
                            type="text"
                            id="location-country"
                            name="location-country"
                            value={locationCountry}
                            onChange={(event) =>
                                setLocationCountry(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-pincode">Pincode</label>
                        <input
                            type="text"
                            id="location-pincode"
                            name="location-pincode"
                            value={locationPincode}
                            onChange={(event) =>
                                setLocationPincode(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-longitude">Longitude</label>
                        <input
                            type="text"
                            id="location-longitude"
                            name="location-longitude"
                            value={locationLongitude}
                            onChange={(event) =>
                                setLocationLongitude(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-latitude">Latitude</label>
                        <input
                            type="text"
                            id="location-latitude"
                            name="location-latitude"
                            value={locationLatitude}
                            onChange={(event) =>
                                setLocationLatitude(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-capacity">Capacity</label>
                        <input
                            type="text"
                            id="location-capacity"
                            name="location-capacity"
                            value={locationCapacity}
                            onChange={(event) =>
                                setLocationCapacity(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-price">Price</label>
                        <input
                            type="text"
                            id="location-price"
                            name="location-price"
                            value={locationPrice}
                            onChange={(event) =>
                                setLocationPrice(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-cover-image-1">
                            Cover Image 1
                        </label>
                        <input
                            type="file"
                            id="location-cover-image-1"
                            name="location-cover-image-1"
                            onChange={(event) =>
                                setLocationCoverImage1(event.target.files[0])
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-cover-image-2">
                            Cover Image 2
                        </label>
                        <input
                            type="file"
                            id="location-cover-image-2"
                            name="location-cover-image-2"
                            onChange={(event) =>
                                setLocationCoverImage2(event.target.files[0])
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-cover-image-3">
                            Cover Image 3
                        </label>
                        <input
                            type="file"
                            id="location-cover-image-3"
                            name="location-cover-image-3"
                            onChange={(event) =>
                                setLocationCoverImage3(event.target.files[0])
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-slider-image-1">
                            Slider Image 1
                        </label>
                        <input
                            type="file"
                            id="location-slider-image-1"
                            name="location-slider-image-1"
                            onChange={(event) =>
                                setLocationSliderImage1(event.target.files[0])
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-slider-image-2">
                            Slider Image 2
                        </label>
                        <input
                            type="file"
                            id="location-slider-image-2"
                            name="location-slider-image-2"
                            onChange={(event) =>
                                setLocationSliderImage2(event.target.files[0])
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-slider-image-3">
                            Slider Image 3
                        </label>
                        <input
                            type="file"
                            id="location-slider-image-3"
                            name="location-slider-image-3"
                            onChange={(event) =>
                                setLocationSliderImage3(event.target.files[0])
                            }
                        />
                    </div>
                    <div className={styles.buttons}>
                        <Button
                            className={styles.btn1}
                            onClick={() => props.setInEditableMode(false)}
                        >
                            Back
                        </Button>
                        <Button
                            className={styles.btn2}
                            onClick={(event) => handleSave(event)}
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </div>

            {/* If user clicks the edit button, the inEditableMode state will be changed in parent component and
            location edit form component will be rendered */}
        </>
    );
};

export default UserProfileEdit;

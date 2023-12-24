import axios from "axios";
import React, { useState, useContext } from "react";
import styles from "./UserProfileEdit.module.css";
import { cloneDeep } from "lodash";
import classes from "../../UI/Buttons/Button.module.css";

const UserProfileEdit = (props) => {
    const userDetails = cloneDeep(props.userDetails);

    const [userImage, setUserImage] = useState(null);

    /** React states to store the updated user data. They are initialized with old data for ease of user */
    const [firstName, setFirstName] = useState(userDetails.name.firstName);
    const [lastName, setLastName] = useState(userDetails.name.lastName);
    const [dob, setDob] = useState(userDetails.dob);
    const [gender, setGender] = useState(userDetails.gender);
    const [email, setEmail] = useState(userDetails.contact.email);
    const [phone, setPhone] = useState(userDetails.contact.phone);
    const [country, setCountry] = useState(userDetails.address.country);
    const [address, setAddress] = useState(userDetails.address.addressMain);
    const [state, setState] = useState(userDetails.address.state);
    const [city, setCity] = useState(userDetails.address.city);
    const [pincode, setPincode] = useState(userDetails.address.pincode);

    /** Function to handle the saving of updated user data */
    const handleSave = async (event) => {
        event.preventDefault();

        /** Since the API post request will contain multipart form data, we are using FormApi to save data */
        const data = new FormData();
        data.append("userImage", userImage);
        data.append("firstName", firstName);
        data.append("lastName", lastName);
        data.append("gender", gender);
        data.append("dob", dob);

        data.append("phone", phone);
        data.append("email", email);

        data.append("addressMain", address);
        data.append("country", country);
        data.append("state", state);
        data.append("city", city);
        data.append("pincode", pincode);

        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/api/update/user`;

            const response = await axios.post(url, data, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            if (response.data.code === 200) {
                alert("User details updated!");
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
            if (error.response.data.code === 500) {
                alert("Error updating user details");
            } else if (error.response.data.code === 401) {
                alert("Unauthorized access");
            }
        }
    };

    return (
        <div className={styles.main}>
            <form className={styles.edit_form}>
                {/* Image selection (TOP PORTION) */}
                <div className={styles.image_container}>
                    <div className={styles.image_field}>
                        <img
                            src={`${process.env.REACT_APP_API_BASE_URL}${userDetails.userImageURL}`}
                            alt="User-profile"
                        />
                        <input
                            type="file"
                            name="userImage"
                            id="userImage"
                            className={styles.image_input}
                            onChange={(e) => setUserImage(e.target.files[0])}
                        />
                        {/* <label htmlFor="userImage"> Select a file </label> */}
                    </div>
                </div>

                {/* Rest of the form (MIDDLE PORTION) */}
                <div className={styles.input_container}>
                    <div className={styles.name_container}>
                        <div className={styles.input_field}>
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                placeholder={firstName}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className={styles.input_field}>
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                placeholder={lastName}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.dob_gender_container}>
                        <div className={styles.input_field}>
                            <label htmlFor="gender">Gender</label> <br></br>
                            <select
                                id="gender"
                                name="gender"
                                value={gender}
                                className={styles.select}
                                defaultValue="Not selected"
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="others">Others</option>
                            </select>
                        </div>
                        <div className={styles.input_field}>
                            <label htmlFor="dob">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                id="dob"
                                placeholder={dob}
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.misc_container}>
                        <label htmlFor="phone">Phone</label>
                        <input
                            type="number"
                            name="phone"
                            id="phone"
                            placeholder={phone}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className={styles.misc_container}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder={email}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.country_state_container}>
                        <div className={styles.input_field}>
                            <label htmlFor="country">Country</label>
                            <input
                                type="text"
                                name="country"
                                id="country"
                                placeholder={country}
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </div>
                        <div className={styles.input_field}>
                            <label htmlFor="state">State</label>
                            <input
                                type="text"
                                name="state"
                                id="state"
                                placeholder={state}
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.city_pin_container}>
                        <div className={styles.input_field}>
                            <label htmlFor="city">City</label>
                            <input
                                type="text"
                                name="city"
                                id="city"
                                placeholder={city}
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>

                        <div className={styles.input_field}>
                            <label htmlFor="pincode">Pincode</label>
                            <input
                                type="number"
                                name="pincode"
                                id="pincode"
                                placeholder={pincode}
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.misc_container}>
                        <label htmlFor="addressMain">Address</label>
                        <input
                            type="text"
                            name="addressMain"
                            id="addressMain"
                            placeholder={address}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </div>

                {/* The butto container (BOTTOM PORTION) */}
                <div className={styles.btn_container}>
                    <button
                        className={`${props.className} ${classes.button} `}
                        onClick={() => props.setInEditableMode(false)}
                    >
                        Back
                    </button>

                    <button
                        className={`${props.className} ${classes.button} `}
                        onClick={(event) => handleSave(event)}
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserProfileEdit;

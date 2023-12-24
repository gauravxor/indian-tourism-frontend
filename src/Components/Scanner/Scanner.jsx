import React, { useEffect, useState } from "react";
import QrReader from "react-qr-scanner";
import axios from "axios";
import ScannerModal from "./ScannerModal";

const Scanner = () => {
    const [accessKey, setAccessKey] = useState("");

    useEffect(() => {
        console.log("here");
        const url = `${process.env.REACT_APP_API_BASE_URL}/scanner/verify`;
        const verifyAccessKey = async () => {
            var keyInput = prompt("Enter the access key");
            while (keyInput) {
                try {
                    const response = await axios.post(
                        url,
                        {
                            accessKey: keyInput,
                        },
                        { withCredentials: true }
                    );
                    if (response.data.code === 200) {
                        setAccessKey(keyInput);
                        alert("Access Granted");
                        break;
                    }
                    keyInput = prompt("Invalid access key, please try again");
                } catch (err) {
                    console.log(err.data);
                    keyInput = prompt("An error occurred, please try again");
                }
            }
        };
        verifyAccessKey();
    }, []);

    const [result, setResult] = useState("");
    const [showEntryModal, setShowEntryModal] = useState(false);

    const handleScan = async (data) => {
        if (data) {
            const bookingId = data.text;
            const url = `${process.env.REACT_APP_API_BASE_URL}/scanner/`;
            data = {
                accessKey: accessKey,
                bookingId: bookingId,
            };
            setResult(" ");
            try {
                const response = await axios.post(url, data, {
                    withCredentials: true,
                });
                if (response.data.code === 200) {
                    setResult(response.data.data.bookingData);
                    setShowEntryModal(true);
                }
            } catch (err) {
                alert(err.response.data.error.message.toUpperCase());
                setResult("");
            }
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    return (
        <div>
            {result === "" && (
                <div className="scanner-component">
                    <QrReader
                        delay={1000}
                        onError={handleError}
                        onScan={handleScan}
                        style={{ height: "100%", width: "100%" }}
                    />
                </div>
            )}

            {result !== "" && showEntryModal && (
                <ScannerModal
                    result={result}
                    setShowEntryModal={setShowEntryModal}
                    setResult={setResult}
                    token={accessKey}
                />
            )}
        </div>
    );
};

export default Scanner;

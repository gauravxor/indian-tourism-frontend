import React, { useEffect, useState } from 'react';
import QrReader from 'react-qr-scanner';
import axios from 'axios';
import ScannerModal from './ScannerModal';

const Scanner = () => {

	const [accessKey, setAccessKey] = useState("");

	useEffect(() => {
		console.log("here");
		const url = "http://localhost:4000/scanner/verify";
		const verifyAccessKey = async () => {
			var keyInput = prompt("Enter the access key");
			while (keyInput) {
				try {
					const response = await axios.post(url, { accessKey: keyInput });
					if (response.data.status === "success") {
						setAccessKey(keyInput);
						alert("Access Granted");
						break;
					}
					keyInput = prompt("Invalid access key, please try again");
				} catch (err) {
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
			const url = "http://localhost:4000/scanner/";
			data = {
				accessKey: "1234567890",
				bookingId: bookingId
			}
			setResult(" ");
			console.log("data: ", data);
			try {
				const response = await axios.post(url, data);
				if (response.data.status === "success") {
					setResult(response.data.data);
					setShowEntryModal(true);
				}
			}
			catch (err) {
				console.log(err);
			}
		}
	};

	const handleError = (err) => {
		console.error(err);
	};


	return (
		<div>
			{result === "" && (<QrReader
				delay={1000}
				onError={handleError}
				onScan={handleScan}
				style={{ width: '50%' }}
			/>)}

			{result !== "" && showEntryModal && (
				<ScannerModal
					result={result}
					setShowEntryModal={setShowEntryModal}
					setResult={setResult}
				/>
			)}
		</div>
	);
};

export default Scanner;
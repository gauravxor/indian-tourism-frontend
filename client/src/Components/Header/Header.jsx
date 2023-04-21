import "./Header.css";

// eslint-disable-next-line
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from "../Modals/LoginModal/LoginModal";
import SignUpModal from "../Modals/SignUpModal/SignUpModal";

import {AppContext} from '../../AppContext.js';

import axios from "axios";
const Header = ( ) => {

	const navigate = useNavigate();

	const { context, setContext } = useContext(AppContext);

	const { isLoggedIn, isLoginModalOpen, isSignUpModalOpen, isUserAdmin} = context;

	const [searchTxt, setSearchTxt] = useState("");

	const handleLogoutClick = async () => {
		console.log("Logout Clicked");

		// data to be sent to the server
		const data = {
			userEmail: context.userEmail,
		}

		try {
			const response = await axios.post(
				"http://localhost:4000/api/auth/logout",
				data
			);
			console.log(response.data);

			// if user logs out reset the app context
			setContext({ ...context,
				isLoggedIn: false,
				isUserAdmin: false,
				isHamburgerCliked: false,
				showMainBody: true,
				userEmail: "",
			});
		}
		catch (error) {
			console.error(error);
		}
	}

	const handleSearchClicked = () => {
		console.log("Search Clicked, re-rendering the main body");
		setContext({ ...context, searchText: searchTxt});
		navigate("/locations");
	}

	const handleLoginClicked = () => {
		console.log("Login Clicked");
		setContext({ ...context, isLoginModalOpen: true});
	}

	const handleSignUpClicked = () => {
		console.log("Signup Clicked");
		setContext({ ...context, isSignUpModalOpen: true});
	}


	return (
		<div className="navbar-container">
			<nav className="navbar">


				<div className="site-logo">
					<img src={process.env.PUBLIC_URL + "/res/icons/site-icon.png"} href="/" alt="Site Logo" />
				</div>

				<div className="navbar-links">

					{isLoggedIn && !isUserAdmin && (<>
						<a href="/">Home</a>
						<a href="/profile">Profile</a>
						<a href="/bookings">Bookings</a>
						<a href="/about">About</a>
						</>
					)}

					{isLoggedIn && isUserAdmin && (<>
						<a href="/">Home</a>
						<a href="/profile">Profile</a>
						<a href="/locations">Locations</a>
						<a href="/add-location">Add Location</a> {/* Implement a modal */}
						<a href="/about">About</a>
						</>
					)}

					{!isLoggedIn && (<>
						<a href="/">Home</a>
						<a href="/locations">Locations</a>
						<a href="/about">About</a>
						</>
					)}
				</div>

				<form className="navbar-search">
					<input type="text" placeholder="Seearch for locations"
						value={searchTxt} onChange={(e) => setSearchTxt(e.target.value)} />
					<button type="submit" onClick = {handleSearchClicked}>Search</button>
				</form>

				<div className="navbar-buttons">
					{context.isLoggedIn && (
						<button onClick = {handleLogoutClick}>Logout</button>
					)}
					{!context.isLoggedIn && ( <>
						<button onClick = {handleLoginClicked}>Login</button>
						<button onClick = {handleSignUpClicked}>Signup</button>
						</>
					)}
				</div>
			</nav>
			{isLoginModalOpen && <LoginModal/>}
			{isSignUpModalOpen && <SignUpModal/>}
		</div>
	);
};

export default Header;
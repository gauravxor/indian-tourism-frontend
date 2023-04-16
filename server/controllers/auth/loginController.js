/**
 * This purpose of this file is to handle the login requests.
 *
 * THE LOGIN PROCESS:
 * The client sends a POST request to the server with the email and password.
 * This request is handled by this file loginController.
 * The login controller receives the EMAIL and PASSWORD from the client.
 *
 * It then searches the USER database for the user with the given email.
 * If the user is not found, then it sends a 404 response.
 * If the user is found, then it searches the database for the credentials of the user.
 * If the credentials are not found, then it sends a 404 response.
 * If the credentials are found, then it checks if the user is already logged in.
 * If the user is already logged in, then it sends a 404 response.
 * If the user is not logged in, then it validates the password.
 * If the password is invalid, then it sends a 404 response.
 * If the password is valid, then it generates an access token and a refresh token.
 * It then updates the login status of the user in the database.
 * It then sends a 200 response with the access token and the refresh token.
 */

const AUTH		= require('../../helper/authHelper');
const TOKENIZER = require('../../helper/jwtHelper');

const loginController = async (req, res, next) => {
	console.log("here");
	const requestEmail = req.body.email;
	const requestPassword = req.body.password;
	let isUserAdmin = req.body.isAdmin;

	if(requestEmail === "" || requestPassword === "" || isUserAdmin !== "true" && isUserAdmin !== "false"){
	 	return res.status(400).send({
			msg: "Bad Request"
		});
	}
	isUserAdmin = (isUserAdmin === "true")? true : false;

	let searchUserResult;
	if(isUserAdmin === true)
		searchUserResult = await AUTH.searchAdmin(requestEmail);
	else
		searchUserResult = await AUTH.searchUser(requestEmail);

	if(searchUserResult === null)
		res.status(404).send({msg: "User not found"});
	else
	{
		/** Storing  userid and email to use in the token generation. Data from request is not used for security reasons */
		const userId = searchUserResult._id;
		const userEmail = searchUserResult.contact.email;

		// local and admin user credentials are saved in the same collection
		searchCredentialsResult = await AUTH.searchCredentials(userId);

		if(searchCredentialsResult === null)
			res.status(404).send({
				msg: "Credentials not found, invalid user"});
		else
		{
			const userPasswordHash = searchCredentialsResult.password;
			const validatePassResult = await AUTH.validatePass(requestPassword, userPasswordHash);
			const userType = (isUserAdmin === true) ? "admin" : "local";
			/** If password hash matches */
			if(validatePassResult)
			{
				const accessToken = await TOKENIZER.generateAccessToken(userId, userEmail, userType);
				var refreshToken = searchCredentialsResult.refreshToken;

				/** For an existing login session, update the accessToken and ask to logout */
				if(refreshToken !== "")
				{
					res
					.cookie('accessToken', 	accessToken,	{ httpOnly: true })
					.cookie('refreshToken', refreshToken,	{ httpOnly: true })
					.status(200)
					.send({
						msg: "Existing session found. Please Logout to continue.",
					});
				}
				else
				{
					/** For a fresh login, generate a new refresh token. */
					console.log("Clean login".yellow);
					refreshToken = await TOKENIZER.generateRefreshToken(userId, userEmail, userType);
					await AUTH.updateLoginStatus(searchCredentialsResult._id, refreshToken);
					res
					.cookie('accessToken',	accessToken,	{ httpOnly: true })
					.cookie('refreshToken',	refreshToken,	{ httpOnly: true })
					.status(200)

					/** If email is verified continue or else move to verification */
					if(searchUserResult.isEmailVerified === false){
						return res.send({
							msg: "Email not verified, please verify your email to processed further",
						});
					}
					else{
						res.send({
							msg: "Logged in successfully",
						});
					}
				}
			}
			else /** If password has does not match */
				res.status(200).send({msg: "Incorrect Password"});
		}
	}
}

module.exports = loginController;
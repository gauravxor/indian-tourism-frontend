const AUTH = require('../../helper/authHelper');


const logoutController = async (req, res) => {

	const requestUserId = req.userId;

	const searchCredentialsResult = await AUTH.searchCredentials(requestUserId);
	if(searchCredentialsResult == null)
		res.status(404).send({msg: "Credentials not found"});
	else
	{
		const credentialsDocumentId = searchCredentialsResult._id;
		const updateLoginStatusResult = await AUTH.updateLoginStatus(credentialsDocumentId, "");
		console.log("Update query result = " + updateLoginStatusResult);
		if(updateLoginStatusResult !== null)
		{
			res
			.clearCookie('accessToken')
			.clearCookie('refreshToken')
			.status(200).send({
				msg: "Logged out successfully",
			});
		}
		else
			res.status(404).send({msg: "Error in updating login/logout status"});
	}
};

module.exports = logoutController;
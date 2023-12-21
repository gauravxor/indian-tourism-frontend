import axios from 'axios';

const tokenData = {
    accessTokenExpiryEpoch: null,
};

async function getAccessTokenExpiryEpoch() {
    const url = `${window.location.protocol}//${window.location.hostname}:4000/api/token/expiry`;
    try {
        const response = await axios.get(url, { withCredentials: true });
        console.log(response);
        if (response.data.code === 200) {
            tokenData.accessTokenExpiryEpoch = response.data.data.accessTokenExpiryEpoch;
        }
    } catch (error) {
        console.log("Failed to get access token expiry epoch");
        localStorage.removeItem("refreshToken");
        return null;
    }
}

async function rotateAuthTokens() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        console.log("No refresh tokens provided with the request");
        return false;
    }

    const url = `${window.location.protocol}//${window.location.hostname}:4000/api/token`;
    try {
        const response = await axios.post(url, { refreshToken });
        if (!(response.data.code === 200)) {
            return false;
        }
        const newRefreshToken = response.data.data.refreshToken;
        localStorage.setItem('refreshToken', newRefreshToken);
        return true;
    } catch (error) {
        return false;
    };
}

async function refreshAccessToken() {
    console.log("Refreshing access token.....")
    const currentTimeEpoch = Date.now();
    if (tokenData.accessTokenExpiryEpoch === null) {
        await getAccessTokenExpiryEpoch();
    }
    console.log("Expiry epoch : ", tokenData.accessTokenExpiryEpoch);
    if (tokenData.accessTokenExpiryEpoch - currentTimeEpoch < 60 * 1000) {
        const result = await rotateAuthTokens();
        if (!result) {
            tokenData.accessTokenExpiryEpoch = null;
            return false;
        }
        return true;
    }
}
export default refreshAccessToken;

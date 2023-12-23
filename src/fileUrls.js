const imageUrls = {
    "gaurav": "https://storage.googleapis.com/indian-tourism-684f2.appspot.com/assets/gaurav.jpg",
    "kaushal": "https://storage.googleapis.com/indian-tourism-684f2.appspot.com/assets/kaushal.jpg",
    "rohit": "https://storage.googleapis.com/indian-tourism-684f2.appspot.com/assets/rohit.jpg",
    "siteLogo": "https://storage.googleapis.com/indian-tourism-684f2.appspot.com/assets/site_logo.png",
    "defaultUserLogo": "https://storage.googleapis.com/indian-tourism-684f2.appspot.com/assets/login_icon.png"
}
export default imageUrls;

/** Using named exports to provide convinence when we want to use single file */
const siteLogo = imageUrls.siteLogo;
const defaultUserLogo = imageUrls.defaultUserLogo;

export {
    siteLogo,
    defaultUserLogo
};
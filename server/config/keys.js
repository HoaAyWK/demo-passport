module.exports = {
    app: {
        name: "MERN DEMO",
        apiUrl: process.env.BASE_API_URL,
        serverUrl: process.env.BASE_SERVER_URL,
        clientUrl: process.env.BASE_CLIENT_URL
    },
    port: process.env.PORT || 5000,
    database: {
        url: process.env.MONGO_URL
    },
    jwt: {
        secret: process.env.JWT_KEY,
        expire: "6h"
    },
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: process.env.GOOGLE_CALLBACK_URL
    },
};
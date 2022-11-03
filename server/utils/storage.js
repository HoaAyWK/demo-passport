const firebaseAdmin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

const serviceAccount = require("../firebase-admin-config.json");

const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});

const storageRef = admin.storage().bucket(process.env.BUCKET_NAME);

exports.uploadFile = async (path, fileName) => {
    let uuid = uuidv4();
    const storage = await storageRef.upload(path, {
        public: true,
        destination: `uploads/images/${fileName}`,
        metadata: {
            firebaseStorageDownloadTokens: uuid
        }
    });
    
    const url = `https://storage.googleapis.com/storage/v1/b/${process.env.BUCKET_NAME_NEW}/o/${encodeURIComponent(storage[0].name)}?alt=media&token=${uuid}`;

    return url;
};
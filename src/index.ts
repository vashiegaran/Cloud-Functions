const functions = require("@google-cloud/functions-framework");

const { onRequest } = require("firebase-functions/v2/https");

// import the entire v2 monolith
const functionsV2 = require("firebase-functions/v2");

// The Firebase Admin SDK to access Firestore.

const deploymentConstant = {
  API_URL: "https://asia-northeast1-marketplace-ssr.cloudfunctions.net",
  ORIGIN:
    "https://marketplace-ssr-default-rtdb.asia-southeast1.firebasedatabase.app",
  REDIRECT_URL: "http://kravve-dev.firebaseapp.com",
  PROJECT_ID: "marketplace-ssr",
  KEYFILE_NAME: "serviceAccountKey.json",
};

var serviceAccount = require(`../${deploymentConstant.KEYFILE_NAME}`);

var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://marketplace-ssr-default-rtdb.asia-southeast1.firebasedatabase.app",
});
//
import cors = require("cors");
import { firestore } from "firebase-admin";
// const corsHandler = cors({ origin: true });

var whitelist = [
  "https://marketplace-ssr.web.app",
  "http://localhost:8080",
  "http://localhost:4200",
  "https://marketplace-ssr.firebaseapp.com",
];

const corsHandler = cors({
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
});
// .region('asia-southeast1')
export const fetchCollection = functions.http((request: any, response: any) => {
  //.region('asia-southeast1')
  //.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    response.set("Access-Control-Allow-Origin", "*");

    let data: any[] = [];
    const body = request.body;
    const payload = body.payload;
    console.log(payload);

    return await admin
      .firestore()
      .collection("productCatalog")
      .get()
      .then(async (snapshot) => {
        snapshot.forEach((doc) => {
          data.push(doc.data());
        });
      })
      .then(() => {
        response.status(200).json(data);
        return true;
      })
      .catch((err) => {
        console.log("error", err);
        return false;
      });
  });
});

// export const fetchDocument = functions.http
//   .region('asia-southeast1')
//   .onRequest((request, response) => {
//     response.set('Access-Control-Allow-Origin', '*');
//     corsHandler(request, response, async () => {
//       const requestBody = request.body;
//       const payload = requestBody.payload;
//       const productID = payload.productID;
//       console.log('product ID', productID);

//       return await firestore()
//         .doc(`productCatalog/${productID}`)
//         .get()
//         .then(async (doc) => {
//           const productData = doc.data();

//           response.status(200).json({
//             productData,
//           });

//           return true;
//         });
//     });
//   });

// // .region('asia-southeast1')
// export const fetchCollection = functions.http((request: any, response: any) => {
//   //.region('asia-southeast1')
//   //.onRequest((request, response) => {
//   corsHandler(request, response, async () => {
//     response.set('Access-Control-Allow-Origin', '*');

//     let data: any[] = [];
//     const body = request.body;
//     const payload = body.payload;
//     console.log(payload);

//     return await admin
//       .firestore()
//       .collection('productCatalog')
//       .get()
//       .then(async (snapshot) => {
//         snapshot.forEach((doc) => {
//           data.push(doc.data());
//         });
//       })
//       .then(() => {
//         response.status(200).json(data);
//         return true;
//       })
//       .catch((err) => {
//         console.log('error', err);
//         return false;
//       });
//   });
// });

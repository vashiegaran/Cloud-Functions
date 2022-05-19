"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCollection = void 0;
const functions = require('@google-cloud/functions-framework');
const { onRequest } = require('firebase-functions/v2/https');
// import the entire v2 monolith
const functionsV2 = require('firebase-functions/v2');
// The Firebase Admin SDK to access Firestore.
const deploymentConstant = {
    API_URL: 'https://asia-northeast1-marketplace-ssr.cloudfunctions.net',
    ORIGIN: 'https://marketplace-ssr-default-rtdb.asia-southeast1.firebasedatabase.app',
    REDIRECT_URL: 'http://kravve-dev.firebaseapp.com',
    PROJECT_ID: 'marketplace-ssr',
    KEYFILE_NAME: 'serviceAccountKey.json',
};
var serviceAccount = require(`../${deploymentConstant.KEYFILE_NAME}`);
var admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://marketplace-ssr-default-rtdb.asia-southeast1.firebasedatabase.app',
});
const cors = require("cors");
// const corsHandler = cors({ origin: true });
var whitelist = [
    'https://marketplace-ssr.web.app',
    'http://localhost:8080',
    'http://localhost:4200',
    'https://marketplace-ssr.firebaseapp.com',
];
const corsHandler = cors({
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
});
// .region('asia-southeast1')
exports.fetchCollection = functions.http((request, response) => {
    //.region('asia-southeast1')
    //.onRequest((request, response) => {
    corsHandler(request, response, () => __awaiter(void 0, void 0, void 0, function* () {
        response.set('Access-Control-Allow-Origin', '*');
        let data = [];
        const body = request.body;
        const payload = body.payload;
        console.log(payload);
        return yield admin
            .firestore()
            .collection('productCatalog')
            .get()
            .then((snapshot) => __awaiter(void 0, void 0, void 0, function* () {
            snapshot.forEach((doc) => {
                data.push(doc.data());
            });
        }))
            .then(() => {
            response.status(200).json(data);
            return true;
        })
            .catch((err) => {
            console.log('error', err);
            return false;
        });
    }));
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
//# sourceMappingURL=index.js.map
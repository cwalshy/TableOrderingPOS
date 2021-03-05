"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Firestore = require('@google-cloud/firestore');
const serviceAccountPath = `./service-accounts/${process.env.SERVICE_ACCOUNT_FILE_NAME}`;
exports.db = new Firestore({
    projectID: process.env.PROJECT_ID,
    keyFilename: serviceAccountPath
});
async function getDocData(docPath) {
    const snap = await exports.db.doc(docPath).get();
    return snap.data();
}
exports.getDocData = getDocData;
async function postOrder(id, data) {
    const res = await exports.db.collection('orders').doc(id).set(data).catch((err) => console.log(err));
}
exports.postOrder = postOrder;
//# sourceMappingURL=db.js.map
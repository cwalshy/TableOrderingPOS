const Firestore = require('@google-cloud/firestore');

const serviceAccountPath = `./service-accounts/${process.env.SERVICE_ACCOUNT_FILE_NAME}`;

export const db = new Firestore({
    projectID: process.env.PROJECT_ID,
    keyFilename: serviceAccountPath
});

export async function getDocData(docPath) {

    const snap = await db.doc(docPath).get();
    return snap.data();

}


export async function postOrder(id: any, data: any) {
 

    const res = await db.collection('orders').doc(id).set(data).catch((err: any) => console.log(err))

}



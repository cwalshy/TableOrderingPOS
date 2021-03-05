"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
async function createCheckoutSession(req, res) {
    try {
        const info = {
            productID: req.body.prodID,
            quantity: req.body.quantity,
            callBackUrl: req.body.callbackUrl
        };
        console.log("Purchasing course with id: ", info.productID[0]);
        console.log(info.productID);
        const checkoutLink = await db_1.getDocData(`products/${info.productID[0]}`);
        let sessionConfig;
        console.log(checkoutLink);
        if (info.productID) {
            const course = await db_1.getDocData(`products/${info.productID[0]}`);
            console.log(info.productID[0], 'test');
            sessionConfig = setupPurchaseCourseSession(info, course);
        }
        const session = await stripe.checkout.sessions.create(sessionConfig);
        console.log('this is the course link' + checkoutLink);
        res.status(200).json({
            stripeCheckoutSessionId: session.id,
            stripePublicKey: process.env.STRIPE_PUBLIC_KEY
        });
    }
    catch (error) {
        console.log('Unexpected error occurred while purchasing course: ', error);
        res.status(500).json({ error: 'could not initiate stripe checkout session' });
    }
}
exports.createCheckoutSession = createCheckoutSession;
function setupPurchaseCourseSession(info, product) {
    const config = setupBaseSessionConfig(info);
    console.log(product, 's');
    console.log(product.title, 't');
    console.log('test');
    config.line_items = [
        {
            name: product.description,
            description: product.subcategory,
            amount: product.price * 100,
            currency: 'aud',
            quantity: 1,
        }
    ];
    return config;
}
function setupBaseSessionConfig(info) {
    const config = {
        payment_method_types: ['card'],
        success_url: `${info.callBackUrl}/?purchaseResult=success`,
        cancel_url: `${info.callBackUrl}/?purchaseResult=failed`
    };
    return config;
}
//# sourceMappingURL=sample.js.map
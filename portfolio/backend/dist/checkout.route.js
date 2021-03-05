"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
async function getCheckoutSession(req, res) {
    try {
        const CheckSession = {
            getSession: req.body.display_items
        };
        console.log(CheckSession.getSession);
        res.status(200).json({});
    }
    catch (error) {
        console.log('Unexpected error occurred while purchasing course: ', error);
        res.status(500).json({ error: 'could not initiate stripe checkout session' });
    }
}
exports.getCheckoutSession = getCheckoutSession;
async function createSession(req, res) {
    try {
        const info = {
            product: req.body.data,
            quantity: req.body.data[0].quantity,
            table: req.body.tableNumber,
            callBackUrl: req.body.callbackUrl
        };
        let sessionConfig;
        let item;
        if (info.product) {
            let prodArray = [];
            let t = 0;
            for (let i = 0; i < info.product.length; i++) {
                item = await db_1.getDocData(`products/${info.product[i].id}`);
                prodArray.push(item);
            }
            sessionConfig = setupPurchaseCourseSession(info, prodArray);
        }
        const session = await stripe.checkout.sessions.create(sessionConfig);
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
exports.createSession = createSession;
function setupPurchaseCourseSession(info, item) {
    const config = setupBaseSessionConfig(info);
    config.line_items =
        [{
                name: item[0].name,
                description: item[0].description,
                amount: item[0].price * 100,
                currency: 'aud',
                quantity: info.quantity,
            }];
    for (let i = 1; i < item.length; i++) {
        config.line_items.push({
            name: item[i].name,
            description: item[i].description,
            amount: item[i].price * 100,
            currency: 'aud',
            quantity: info.product[i].quantity,
        });
    }
    return config;
}
function setupBaseSessionConfig(info) {
    const config = {
        payment_method_types: ['card'],
        success_url: `${info.callBackUrl}/success`,
        cancel_url: `${info.callBackUrl}/failed`,
        metadata: { 'table': info.table }
    };
    return config;
}
//# sourceMappingURL=checkout.route.js.map
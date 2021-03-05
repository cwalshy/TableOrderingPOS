import {Request, Response} from 'express';
import { Session } from 'inspector';
import { callbackify } from 'util';

import { getDocData } from './db';

const stripe = require ('stripe')(process.env.STRIPE_SECRET_KEY);

interface RequestInfo {
    productID: string;
    quantity: string;
    callBackUrl: string;
}


export async function createCheckoutSession(req: Request, res: Response) {
        try {
        const info: RequestInfo = {
            productID: req.body.prodID,
            quantity: req.body.quantity,
            callBackUrl: req.body.callbackUrl
        };
        
        console.log("Purchasing course with id: ", info.productID[0]);
        console.log(info.productID);
        const checkoutLink = await getDocData(`products/${info.productID[0]}`);
        let sessionConfig;
        console.log(checkoutLink);

        if (info.productID) {
            const course = await getDocData(`products/${info.productID[0]}`);
            console.log(info.productID[0], 'test');

            sessionConfig = setupPurchaseCourseSession(info, course);
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);
        // console.log(session);
        console.log('this is the course link' + checkoutLink);

        res.status(200).json({
            stripeCheckoutSessionId: session.id,
            stripePublicKey: process.env.STRIPE_PUBLIC_KEY
        });

    } catch (error) {
            console.log('Unexpected error occurred while purchasing course: ', error);
            res.status(500).json({error: 'could not initiate stripe checkout session'});

        }
}
function setupPurchaseCourseSession(info: RequestInfo, product) {
    
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

function setupBaseSessionConfig(info: RequestInfo) {
    const config: any = {
        payment_method_types: ['card'],
        success_url: `${info.callBackUrl}/?purchaseResult=success`,
        cancel_url: `${info.callBackUrl}/?purchaseResult=failed`
    };
    return config;
}


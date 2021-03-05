import {Request, Response} from 'express';
import { Session } from 'inspector';
import { callbackify } from 'util';

import { getDocData } from './db';

const stripe = require ('stripe')(process.env.STRIPE_SECRET_KEY);


interface Products {
    itemName: string,
    id: string,
    quantity: string
}

interface RequestInfo {
    product: Array<Products>;
    quantity: string;
    table: string;
    callBackUrl: string;
}
// interface RequestInfo extends Array<RequestInfo>{}

interface CheckSession {
    getSession: string;
}

export async function getCheckoutSession(req: Request, res: Response) {
    try {
        const CheckSession: CheckSession = {
            getSession: req.body.display_items
        }
        console.log(CheckSession.getSession);
    res.status(200).json({
    });

} catch (error) {
        console.log('Unexpected error occurred while purchasing course: ', error);
        res.status(500).json({error: 'could not initiate stripe checkout session'});

    }
}


//create session function
export async function createSession(req: Request, res: Response) {
//pass body data into RequestInfo interface
        try {
        const info: RequestInfo = {
            product: req.body.data,
            quantity: req.body.data[0].quantity,
            table: req.body.tableNumber,
            callBackUrl: req.body.callbackUrl
        }
    

        
        let sessionConfig;
        let item;
        //if product isnt empty search database by product i
        //store all products in array
        if (info.product) {
            let prodArray = []
            let t = 0;
            for(let i = 0; i < info.product.length; i++) {
            item = await getDocData(`products/${info.product[i].id}`); 
            prodArray.push(item);

            }
            //pass RequestInfo Interface and products array into setup purchase course session
            sessionConfig = setupPurchaseCourseSession(info, prodArray);
    }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        res.status(200).json({
            stripeCheckoutSessionId: session.id,
            stripePublicKey: process.env.STRIPE_PUBLIC_KEY
        });


    } catch (error) {
            console.log('Unexpected error occurred while purchasing course: ', error);
            res.status(500).json({error: 'could not initiate stripe checkout session'});

        }
}
 function setupPurchaseCourseSession(info: RequestInfo, item ) {
    const config = setupBaseSessionConfig(info);
//pass items from product array retrieved from data base into line items

    config.line_items = 
        [{
            name: item[0].name,
            description: item[0].description,
            amount: item[0].price * 100,
            currency: 'aud',
            quantity: info.quantity,
        }];

//if there's more than one item to add loop over products then add each item
    for(let i = 1; i < item.length; i++) {
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

//pass success urls and metedata to be recieved by webhooks
function setupBaseSessionConfig(info: RequestInfo) {
    const config: any = {
        payment_method_types: ['card'],
        success_url: `${info.callBackUrl}/success`,
        cancel_url: `${info.callBackUrl}/failed`,
        metadata: {'table': info.table.toString}
    };
    return config;
}
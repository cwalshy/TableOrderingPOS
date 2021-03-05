import * as express from 'express';
import {Application} from 'express';
import {getCheckoutSession, createSession} from './checkout.route';
// import {listenHooks} from './routes';
import {Request, Response} from 'express';
import {postOrder} from './db';
import { Timestamp } from '@google-cloud/firestore';

import { createCommaList } from 'typescript';

export interface item {
    name: string;
    quantity: string;
    cost: string;
  }
  export interface order {
    item: [{
      name: string
      quantity: string,
      cost: string,
    }]
    totalCost: Number,
    timestamp: Timestamp;
    orderCompleted: boolean;
    tableNumber: string;
  }

export function initServer() {
    const app: Application = express();
    const bodyParser = require('body-parser');

    app.route('/').get((req, res) => {
        res.status(200).send('<h1>API is up and running</h1>');
    });
    const PORT = process.env.PORT || 9000;

    app.route('/api/checkout').post(bodyParser.json(), createSession);

    app.post('/hooks', bodyParser.raw({type: 'application/json'}), (request, response) => {
        let event;
        try {
          event = JSON.parse(request.body);
        } catch (err) {
          console.log(`⚠️  Webhook error while parsing basic request.`, err.message);
          return response.send();
        }
        try {
        // Handle the event
        switch (event.type) {

          case 'payment_intent.created':
            const paymentIntentCreated = event.data.object;

            console.log(paymentIntentCreated);
        // Unexpected event type
          break;

          case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
            break;
          case 'payment_method.attached':
            const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
            break;
          case 'checkout.session.completed':
            const checkoutSession = event.data.object;
            try {
        //function to map items extracted from webhooks into custom interface to be then pushed into firebase
          function mapItems() {
            var items;
        //init order interface with first line items
            let dataItem: order = {
                item: [{
                  cost: checkoutSession.display_items[0].amount,
                  name: checkoutSession.display_items[0].custom.name,
                  quantity: checkoutSession.display_items[0].quantity,
                }],
                totalCost: checkoutSession.amount_total,
                timestamp: Timestamp.now(),
                orderCompleted: false,
                tableNumber: checkoutSession.metadata.table,
                }
        //if order interface contains more than one item add that to the array
              for(let i = 1; i < checkoutSession.display_items.length; i++) {
               let item: item = {
                    cost: checkoutSession.display_items[i].amount,
                    name: checkoutSession.display_items[i].custom.name,
                    quantity: checkoutSession.display_items[i].quantity,
               }
               dataItem.item.push(item);
              }
              items = dataItem;
        //post order to firebase
              postOrder(checkoutSession.id, items);

          }
          mapItems();

          }
            catch (error) {
            console.log('Unexpected error occurred', error);

            }

          default:
        // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
        }
    } catch (error) {
        console.log('Unexpected error occurred', error);
        response.status(500).json({error: 'sending/recieving data'});

    }
        // Return a 200 response to acknowledge receipt of the event
        response.send();
      });

    app.route('/hooks').post(bodyParser.json(), getCheckoutSession);

    app.listen(PORT, () => {
        console.log('HTTP REST API SERVER IS UP AND RUNNING AT PORT ' + PORT);
    });
}
  
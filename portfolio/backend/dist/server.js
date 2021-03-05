"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const checkout_route_1 = require("./checkout.route");
const db_1 = require("./db");
const firestore_1 = require("@google-cloud/firestore");
function initServer() {
    const app = express();
    const bodyParser = require('body-parser');
    app.route('/').get((req, res) => {
        res.status(200).send('<h1>API is up and running</h1>');
    });
    const PORT = process.env.PORT || 9000;
    app.route('/api/checkout').post(bodyParser.json(), checkout_route_1.createSession);
    app.post('/hooks', bodyParser.raw({ type: 'application/json' }), (request, response) => {
        let event;
        try {
            event = JSON.parse(request.body);
        }
        catch (err) {
            console.log(`⚠️  Webhook error while parsing basic request.`, err.message);
            return response.send();
        }
        try {
            switch (event.type) {
                case 'payment_intent.created':
                    const paymentIntentCreated = event.data.object;
                    console.log(paymentIntentCreated);
                    break;
                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object;
                    console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
                    break;
                case 'payment_method.attached':
                    const paymentMethod = event.data.object;
                    break;
                case 'checkout.session.completed':
                    const checkoutSession = event.data.object;
                    try {
                        function mapItems() {
                            var items;
                            let dataItem = {
                                item: [{
                                        cost: checkoutSession.display_items[0].amount,
                                        name: checkoutSession.display_items[0].custom.name,
                                        quantity: checkoutSession.display_items[0].quantity,
                                    }],
                                totalCost: checkoutSession.amount_total,
                                timestamp: firestore_1.Timestamp.now(),
                                orderCompleted: false,
                                tableNumber: checkoutSession.metadata.table,
                            };
                            for (let i = 1; i < checkoutSession.display_items.length; i++) {
                                let item = {
                                    cost: checkoutSession.display_items[i].amount,
                                    name: checkoutSession.display_items[i].custom.name,
                                    quantity: checkoutSession.display_items[i].quantity,
                                };
                                dataItem.item.push(item);
                            }
                            items = dataItem;
                            db_1.postOrder(checkoutSession.id, items);
                        }
                        mapItems();
                    }
                    catch (error) {
                        console.log('Unexpected error occurred', error);
                    }
                default:
                    console.log(`Unhandled event type ${event.type}.`);
            }
        }
        catch (error) {
            console.log('Unexpected error occurred', error);
            response.status(500).json({ error: 'sending/recieving data' });
        }
        response.send();
    });
    app.route('/hooks').post(bodyParser.json(), checkout_route_1.getCheckoutSession);
    app.listen(PORT, () => {
        console.log('HTTP REST API SERVER IS UP AND RUNNING AT PORT ' + PORT);
    });
}
exports.initServer = initServer;
//# sourceMappingURL=server.js.map
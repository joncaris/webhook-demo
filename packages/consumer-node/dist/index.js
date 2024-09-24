"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ajv_1 = __importDefault(require("ajv"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const port = 3000;
const ajv = new ajv_1.default();
app.use(express_1.default.json());
const webhookDataSchema = {
    type: 'object',
    properties: {
        event: { type: 'string' },
        data: {
            type: 'object',
            properties: {
                order_id: { type: 'number' },
                customer_name: { type: 'string' },
                total_amount: { type: 'number' }
            },
            required: ['order_id', 'customer_name', 'total_amount']
        }
    },
    required: ['event', 'data']
};
const validateWebhookData = ajv.compile(webhookDataSchema);
app.post('/webhook', (req, res) => {
    console.log('Received webhook request', req.body);
    try {
        const webhookData = req.body;
        console.log('Recieved webhook data: ', webhookData);
        //Validate schema of data
        if (!validateWebhookData(webhookData)) {
            console.error('Invalid webhook data:', validateWebhookData.errors);
            res.sendStatus(400);
            return;
        }
        //Process data based on event type
        switch (webhookData.event) {
            case 'order.created':
                //handle order creation
                break;
            case 'order.shipped':
                //handle shipment
                break;
            default:
                console.error('Unknown webhook event: ', webhookData.event);
        }
        res.sendStatus(200);
    }
    catch (error) {
        console.error('Error processing webhook: ', error);
        res.sendStatus(500);
    }
});
app.listen(port, () => {
    console.log(`Webhook server listening at http://localhost:${port}`);
});
//subsribe to ordercreated events
axios_1.default.post('http://localhost:3001/subscribe', {
    userId: 'user123', // Replace with your actual user ID
    event: 'order.created',
    webhookUrl: 'http://localhost:3000/webhook' // The URL of your consumer's webhook endpoint
})
    .then(response => {
    console.log('Subscription successful:', response.data);
})
    .catch(error => {
    console.error('Error subscribing to webhook:', error);
});

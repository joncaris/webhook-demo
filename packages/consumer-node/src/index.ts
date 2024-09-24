import express from 'express';
import Ajv, { JSONSchemaType } from 'ajv';
import axios from 'axios';




const app = express();
const port = 3000;

const ajv = new Ajv();

app.use(express.json());

interface WebhookData {
    event: string;
    data: {
        order_id: number;
        customer_name: string;
        total_amount: number;
    };
}

const webhookDataSchema: JSONSchemaType<WebhookData> = {
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
        const webhookData: WebhookData = req.body;
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
    } catch (error) {
        console.error('Error processing webhook: ', error);
        res.sendStatus(500);
    }
});

app.listen(port, () => {
    console.log(`Webhook server listening at http://localhost:${port}`);
})

//subsribe to ordercreated events
axios.post('http://localhost:3001/subscribe', {
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
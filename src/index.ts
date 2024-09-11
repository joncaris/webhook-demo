import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

interface WebhookData {
    event: string;
    data: any;
}

app.post('/webhook', (req, res) => {
    try {
        const webhookData: WebhookData = req.body;

        console.log('Recieved webhook data: ', webhookData.event);
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
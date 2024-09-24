import express from 'express';
import axios from 'axios';


const app = express();
const port = 3001; 

app.use(express.json()); 

// In-memory storage for subscriptions (replace with a database in real application)
const subscriptions: { [event: string]: string[] } = {};

app.post('/subscribe', (req, res) => {
    const { userId, event } = req.body;
    const webhookUrl = req.body.webhookUrl; 

    if (!subscriptions[event]) {
        subscriptions[event] = [];
    }
    subscriptions[event].push(webhookUrl);

    res.status(200).json({ message: 'Subscribed successfully' });
});

app.post('/trigger_event', async (req, res) => {
    const { event, data } = req.body;

    if (subscriptions[event]) {
        for (const webhookUrl of subscriptions[event]) {
            try {
                await axios.post(webhookUrl, { event, data });
                console.log(`Webhook sent successfully to ${webhookUrl}`);
            } catch (error) {
                console.error(`Error sending webhook to ${webhookUrl}:`, error);
            }
        }
    }

    res.status(200).json({ message: 'Event triggered' });
});

app.listen(port, () => {
    console.log(`Webhook producer listening at http://localhost:${port}`);
});
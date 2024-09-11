import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.post('webhook', (req, res) => {
    const webhookData = req.body;

    console.log('Recieved webhook data: ', webhookData);

    // TODO: process webhook data

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Webhook server listening at http://localhost:${port}`);
})
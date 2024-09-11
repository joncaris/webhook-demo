"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.post('webhook', (req, res) => {
    const webhookData = req.body;
    console.log('Recieved webhook data: ', webhookData);
    // TODO: process webhook data
    res.sendStatus(200);
});
app.listen(port, () => {
    console.log(`Webhook server listening at http://localhost:${port}`);
});

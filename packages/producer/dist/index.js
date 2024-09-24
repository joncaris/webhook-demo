"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const port = 3001;
app.use(express_1.default.json());
// In-memory storage for subscriptions (replace with a database in real application)
const subscriptions = {};
app.post('/subscribe', (req, res) => {
    const { userId, event } = req.body;
    const webhookUrl = req.body.webhookUrl;
    if (!subscriptions[event]) {
        subscriptions[event] = [];
    }
    subscriptions[event].push(webhookUrl);
    res.status(200).json({ message: 'Subscribed successfully' });
});
app.post('/trigger_event', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { event, data } = req.body;
    if (subscriptions[event]) {
        for (const webhookUrl of subscriptions[event]) {
            try {
                yield axios_1.default.post(webhookUrl, { event, data });
                console.log(`Webhook sent successfully to ${webhookUrl}`);
            }
            catch (error) {
                console.error(`Error sending webhook to ${webhookUrl}:`, error);
            }
        }
    }
    res.status(200).json({ message: 'Event triggered' });
}));
app.listen(port, () => {
    console.log(`Webhook producer listening at http://localhost:${port}`);
});

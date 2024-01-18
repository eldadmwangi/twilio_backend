const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json())
app.use(cors())
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

console.log('STARTING........')

const client = require('twilio')(accountSid, authToken);

app.get('/', (req, res) => {
  res.send('Twilio testing');
})

app.post('/send-text',  async (req, res) => {
  const { message, recipients } = req.body;

    if (!Array.isArray(recipients)) {
      return res.status(400).json({ success: false, error: 'Recipients should be an array' });
    }

    try {
      const messages = await Promise.all(
        recipients.map((recipient) =>
          client.messages.create({
             body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: recipient,
          })
          ));
            res.json({ success: true, messages });
        } catch (error) {
          res.status(500).json({ success: false, error: error.message });
        }
    });
    
    app.listen(8080, () => {
      console.log('Server is running on port 8080');
    });

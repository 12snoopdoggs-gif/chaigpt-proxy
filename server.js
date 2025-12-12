const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dialogflow = require("@google-cloud/dialogflow");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PROJECT_ID = "chaigpt-3-0-99dj";

app.post("/dialogflow", async (req, res) => {
  try {
    const { text, sessionId } = req.body;

    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(
      PROJECT_ID,
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: "en-US",
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({
      reply: result.fulfillmentText,
    });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Dialogflow error." });
  }
});

app.get("/", (req, res) => {
  res.send("ChaiGPT Dialogflow Proxy Running!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Running on " + port));

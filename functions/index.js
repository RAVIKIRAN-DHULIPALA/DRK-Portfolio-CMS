const functions = require('firebase-functions');
const { PredictionServiceClient } = require('@google-cloud/aiplatform');
const { helpers } = require('@google-cloud/aiplatform');
const cors = require('cors')({ origin: true });

// Firebase Admin SDK for authentication
const admin = require('firebase-admin');
admin.initializeApp();

exports.secureTextPredictor = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            // Verify the user's authentication token
            const authorizationHeader = req.get('Authorization');
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                return res.status(403).json({ error: 'Unauthorized' });
            }



            // Replace these values with your actual project, location, publisher, and model
            const project = 'XXXX';
            const location = 'XXXX';
            const publisher = 'google';
            const model = 'text-bison@001';

            const inputText = req.body.inputText;
            if (!inputText) {
                return res.status(400).json({ error: 'Request body is missing inputText.' });
            }

            // Configure the parent resource
            const endpoint = `projects/${project}/locations/${location}/publishers/${publisher}/models/${model}`;

            const instanceValue = helpers.toValue({ prompt: inputText });
            const instances = [instanceValue];

            const parameters = helpers.toValue({
                candidateCount: 3,
                temperature: 0.2,
                maxOutputTokens: 256,
                topP: 0.95,
                topK: 40,
            });

            const request = {
                endpoint,
                instances,
                parameters,
            };

            // Predict request
            const predictionServiceClient = new PredictionServiceClient(
                {
                    apiEndpoint: 'us-central1-aiplatform.googleapis.com'
                }
            );
            const response = await predictionServiceClient.predict(request);
            res.status(200).send({ data: response[0].predictions })
        } catch (error) {
            console.error('Error predicting:', error);
            throw new functions.https.HttpsError('internal', 'Prediction failed');
        }
    });
});

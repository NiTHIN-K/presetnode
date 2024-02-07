const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Enable CORS for all routes and origins
app.use(cors());

app.use(express.json());

app.post('/get-guest-token', async (req, res) => {
    const authUrl = 'https://api.app.preset.io/v1/auth/';
    const tokenUrl = 'https://api.app.preset.io/v1/teams/c7d407a5/workspaces/ac5f3d67/guest-token/';
    
    try {
        // First Request - Authentication
        const authResponse = await axios.post(authUrl, {
            name: "424aeb9c-7424-407b-add8-15aa8a0c9c7b",
            secret: "415e4d4cc032c22f9ca342d16bf218405b0a4964a5b6ea411cbe465b56772918"
        }, {
            headers: {
                'Cookie': '__scid__=b27c0d17-d028-4e05-bf76-3a288ed169ce',
                'Content-Type': 'application/json',
                'User-Agent': 'insomnia/8.4.2'
            }
        });

        const accessToken = authResponse.data.payload.access_token; // Adjust according to actual response structure

        // Second Request - Using the Access Token
        const tokenResponse = await axios.post(tokenUrl, {
            user: {
                username: "nithin@sahyog.ai",
                first_name: "Nithin",
                last_name: "Last"
            },
            resources: [
                {
                    type: "dashboard",
                    id: "695106ec-5e10-43ca-b7a9-942d763d4c11"
                }
            ],
            rls: []
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        });

        res.json({ token: tokenResponse.data.payload.token }); // Adjust according to actual response structure
    } catch (error) {
        console.error('Error making API requests:', error);
        res.status(500).json({ error: 'Failed to retrieve guest token' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');


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
                'Content-Type': 'application/json',
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
                },
                {
                    type: "dashboard",
                    id: "d312d69c-c6cd-4af7-a527-8c2bf99c0292"
                },
                {
                    type: "dashboard",
                    id: "03a39a8e-5787-45bb-b0d0-ca534eb7902e"
                }
                // Add more dashboard IDs here as needed
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



// Set up multer for file handling
const upload = multer({ dest: 'uploads/' }); // This will save files to an 'uploads' directory. Adjust as needed.

app.post('/upload', upload.single('file'), (req, res) => {
    // req.file is the 'file' file
    // req.body will hold the text fields, if there were any

    console.log(req); // You can use this to see file information
    console.log(req.body.file); // You can use this to see file information

    res.json({ message: 'File uploaded successfully' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

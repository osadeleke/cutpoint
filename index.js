const express = require('express');
const { nanoid, customAlphabet } = require('nanoid');
const bcrypt = require('bcrypt');
// const cors = require('cors');
const path = require("path");
const app = express();
const port = 3000;

app.use(express.json());

// app.use(cors({
//     origin: '*'
// }))

app.use(express.static(path.join(__dirname, "frontend/build")));

// Catch-all route to serve React's index.html for any frontend route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

// Global in memory cache
const cache = new Map();

const hashedPassword = "$2a$12$r5eE.4WITW5u2HJcoAgdhudRWztGNS/bcGSDRFkT.vcSJ52U23mTy";

app.get('/', (req, res) => {
    res.send("Hello world!");
    res.end();
})


app.post("/generate", (req, res) => {

    if (!req.body) return res.status(400).send("Please, enter url to shorten.");

    const { url1, url2 } = req.body;
    if (!url1 || !url2) return res.status(400).send("Please provide two URLs.");

    if (url1.length < 1 || url2.length < 1) return res.status(400).send("URLs cannot be empty.");

    const generateID = customAlphabet("0123456789", 10);

    let shortCode = nanoid(6);

    while (cache.get(shortCode)) {
        shortCode = nanoid(6)
    }

    const shortenedUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;
    
    const body = {
        createdAt: new Date(),
        urls:  [
            {
                id: generateID(), 
                link: url1, 
                originalLength: url1.length,
                hits: 0,
                percentDecrease: `${Math.round(((url1.length - shortCode.length) / url1.length) * 100)}%`
            }, 
            {
                id: generateID(), 
                link: url2, 
                originalLength: url2.length,
                hits: 0,
                percentDecrease: `${Math.round(((url2.length - shortCode.length) / url2.length) * 100)}%`
            }
        ],
        get totalHits() {
            return this.urls.reduce((sum, url) => sum + url.hits, 0);
        }
    }
    
    cache.set(shortCode, body);

    res.json({
            shortenedUrl: shortenedUrl,
            lengthOfNewUrl: shortenedUrl.length,
            urls: cache.get(shortCode)
        });
});

app.get('/:code', (req, res) => {

    const { code } = req.params;

    if (!/^[A-Za-z0-9_-]{6}$/.test(code)) {
        return res.status(404).send("Not a valid short code");
    }

    const data = cache.get(code);

    if (!data) return res.status(400).send("Not a valid short code");

    const idx = Math.random() < 0.5 ? 0 : 1;

    data.urls[idx].hits += 1;

    res.redirect(data.urls[idx].link);
    res.end();
})

const protectAdmin = async (req, res, next) => {
    const password = req.query.password;
    if (!password) return res.status(401).send("Input your password to access!");

    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) return res.status(401).send("Invalid password");

    next();
}

app.get('/admin/dashboard', protectAdmin, (req, res) => {
    const cacheObj = {};

    for (const [key, value] of cache.entries()) {
        cacheObj[key] = {
        ...value,
        totalHits: value.urls.reduce((sum, url) => sum + url.hits, 0)
        };
    }

    res.send(cacheObj);
    res.end();
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`)
})
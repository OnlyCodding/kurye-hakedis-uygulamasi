require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-iletmen';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || '123456';
const MONGO_URI = process.env.MONGO_URI;

let AppDataModel = null;
if (MONGO_URI) {
    mongoose.connect(MONGO_URI).then(() => {
        console.log('MongoDB bağlantısı başarılı.');
        const schema = new mongoose.Schema({ type: { type: String, default: 'app_data' }, data: Object });
        AppDataModel = mongoose.model('AppData', schema);
    }).catch(err => console.error('MongoDB bağlantı hatası:', err));
}

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Static files
app.use(express.static(__dirname));

// API: Get Data
app.get('/api/data', async (req, res) => {
    if (AppDataModel) {
        try {
            const doc = await AppDataModel.findOne({ type: 'app_data' });
            if (!doc && fs.existsSync(path.join(__dirname, 'db.json'))) {
                // Migrate from local JSON if first time
                const localData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
                await AppDataModel.create({ type: 'app_data', data: localData });
                return res.json(localData);
            }
            return res.json(doc ? doc.data : {});
        } catch(e) { return res.status(500).json({}); }
    }
    
    const dbPath = path.join(__dirname, 'db.json');
    if (!fs.existsSync(dbPath)) return res.json({});
    res.setHeader('Content-Type', 'application/json');
    res.send(fs.readFileSync(dbPath, 'utf8'));
});

// API: Save Data
app.post('/api/save', async (req, res) => {
    if (AppDataModel) {
        try {
            await AppDataModel.findOneAndUpdate({ type: 'app_data' }, { data: req.body }, { upsert: true });
            return res.json({ success: true });
        } catch(e) { return res.status(500).json({ success: false }); }
    }

    const dbPath = path.join(__dirname, 'db.json');
    try {
        fs.writeFileSync(dbPath, JSON.stringify(req.body, null, 4));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Kayıt başarısız.' });
    }
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor...`);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const axios = require('axios');
const crypto = require('crypto');
const https = require('https');
const { ObjectId } = mongoose.Types;
require('dotenv').config();

const app = express();
app.set('trust proxy', 1);
// ==================== CONFIGURATION ====================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = "lifedrop108@gmail.com";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
const SECRET_KEY = process.env.SECRET_KEY || 'lifedrop-super-secret-key-2024';

// ==================== MIDDLEWARE ====================
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: [
    "http://localhost:5173",
    "https://life-drop-ai.vercel.app",
    "capacitor://localhost", 
    "https://localhost",
    "http://localhost",
    "https://lifedrop-ai.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(helmet({
    contentSecurityPolicy: false
}));


app.use((req, res, next) => {
    if (req.method === 'POST') {
        console.log(`📥 Incoming POST Request: ${req.url}`);
        console.log(`📦 Payload Size: ${Math.round(JSON.stringify(req.body).length / 1024)} KB`);
    }
    next();
});

// Session configuration
app.use(session({
  name: "lifedrop.sid",
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    collectionName: "sessions"
  }),
  cookie: {
    secure: true,        // 🔥 Render is HTTPS
    httpOnly: true,
    sameSite: "none",    // 🔥 Cross-site (Vercel → Render)
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 50, // 50 requests per window
    message: {
        success: false,
        message: "Too many attempts! You are blocked for 10 minutes for security reasons."
    },
    keyGenerator: (req) => {
        return req.ip || req.connection.remoteAddress;
    }
});

// Custom rate limit for login attempts
const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: "Too many login attempts! Please try after 10 minutes."
    }
});

// ==================== MONGODB CONNECTION ====================
mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB Disconnected! Attempting to reconnect...');
});

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4 // IPv4 use panna innum fast-ah irukkum
}).then(() => {
    console.log('✅ MongoDB Connected Successfully');
    initDatabase();
})
.catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    console.warn('⚠️ Retrying in background...');
});

// ==================== SCHEMA DEFINITIONS ====================
const donorSchema = new mongoose.Schema({
    unique_id: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    blood_group: { type: String, required: true },
    dob: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    health_score: { type: Number, required: true },
    last_donation_date: { type: Date, default: null },
    donation_count: { type: Number, default: 0 },
    cooldown_email_sent: { type: Boolean, default: false },
    is_available: { type: Boolean, default: true },
    community: { type: String, default: "Public" }, // 'Public' or 'Periyar University'
    department: { type: String },
    role_type: { type: String }, // 'Student' or 'Staff'
    year: { type: String },
    id_card_image: { type: String },
    is_verified: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

const requesterSchema = new mongoose.Schema({
    unique_id: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    community: { type: String, default: "Public" },
    department: { type: String },
    role_type: { type: String },
    year: { type: String },
    is_verified: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

const bloodRequestSchema = new mongoose.Schema({
    requester_id: { type: String, required: true },
    patient_name: { type: String, required: true },
    contact_number: { type: String, required: true },
    blood_group: { type: String, required: true },
    units: { type: Number, required: true },
    urgency: { type: Number, required: true },
    hospital: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    timestamp: { type: Date, default: Date.now }
});

const notificationSchema = new mongoose.Schema({
    donor_id: { type: String, required: true },
    request_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: { type: String, default: 'Pending' },
    blood_bag_id: { type: String, default: null },
    created_at: { type: Date, default: Date.now }
});

const otpVerificationSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, expires: 600 } 
});

const bloodInventorySchema = new mongoose.Schema({
    blood_group: { type: String, required: true, unique: true },
    units: { type: Number, default: 0 },
    last_updated: { type: Date, default: Date.now }
});

const blockchainLedgerSchema = new mongoose.Schema({
    index: { type: Number, required: true },
    request_id: { type: String, required: true },
    event: { type: String, required: true },
    data: { type: String, required: true },
    previous_hash: { type: String, required: true },
    current_hash: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const broadcastSchema = new mongoose.Schema({
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const bloodCampSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    organizer: { type: String, default: 'LifeDrop Official' },
    created_at: { type: Date, default: Date.now }
});

const loginAttemptSchema = new mongoose.Schema({
    ip: { type: String, required: true, unique: true },
    count: { type: Number, default: 1 },
    first_attempt: { type: Date, default: Date.now },
    blocked_until: { type: Date, default: null }
});
const auditLogSchema = new mongoose.Schema({
    user_id: { type: String }, 
    email: { type: String },
    action: { type: String }, 
    ip_address: { type: String },
    device_info: { type: String },
    timestamp: { type: Date, default: Date.now }
});

// ==================== MODELS ====================
const Donor = mongoose.model('Donor', donorSchema);
const Requester = mongoose.model('Requester', requesterSchema);
const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const OTPVerification = mongoose.model('OTPVerification', otpVerificationSchema);
const BloodInventory = mongoose.model('BloodInventory', bloodInventorySchema);
const BlockchainLedger = mongoose.model('BlockchainLedger', blockchainLedgerSchema);
const Broadcast = mongoose.model('Broadcast', broadcastSchema);
const BloodCamp = mongoose.model('BloodCamp', bloodCampSchema);
const LoginAttempt = mongoose.model('LoginAttempt', loginAttemptSchema);
const AuditLog = mongoose.model('AuditLog', auditLogSchema);
// ==================== UTILITY FUNCTIONS ====================

// Blood Compatibility Mapping
const BLOOD_COMPATIBILITY = {
    "A+": ["A+", "A-", "O+", "O-"],
    "A-": ["A-", "O-"],
    "B+": ["B+", "B-", "O+", "O-"],
    "B-": ["B-", "O-"],
    "AB+": ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    "AB-": ["A-", "B-", "O-", "AB-"],
    "O+": ["O+", "O-"],
    "O-": ["O-"]
};

// Check Login Block
async function checkLoginBlock(ipAddress) {
    const now = new Date();
    const record = await LoginAttempt.findOne({ ip: ipAddress });

    if (record && record.blocked_until) {
        if (now < record.blocked_until) {
            const remainingTime = Math.ceil((record.blocked_until - now) / (1000 * 60));
            return { allowed: false, message: `Too many attempts! You are blocked. Try again after ${remainingTime} minutes.` };
        } else {
            await LoginAttempt.deleteOne({ ip: ipAddress });
        }
    }
    return { allowed: true, message: null };
}

// Log Failed Attempt
async function logFailedAttempt(ipAddress) {
    const now = new Date();
    const threeMinsAgo = new Date(now - 3 * 60 * 1000);
    
    let record = await LoginAttempt.findOne({ ip: ipAddress });

    if (!record) {
        await LoginAttempt.create({
            ip: ipAddress,
            count: 1,
            first_attempt: now,
            blocked_until: null
        });
    } else {
        if (record.first_attempt > threeMinsAgo) {
            const newCount = record.count + 1;
            if (newCount >= 3) {
                await LoginAttempt.updateOne(
                    { ip: ipAddress },
                    { $set: { count: newCount, blocked_until: new Date(now.getTime() + 10 * 60 * 1000) } }
                );
            } else {
                await LoginAttempt.updateOne(
                    { ip: ipAddress },
                    { $inc: { count: 1 } }
                );
            }
        } else {
            await LoginAttempt.updateOne(
                { ip: ipAddress },
                { $set: { count: 1, first_attempt: now, blocked_until: null } }
            );
        }
    }
}

// Send Brevo OTP Email - FIXED VERSION
async function sendBrevoOTP(email, otp) {
    const url = "https://api.brevo.com/v3/smtp/email";
    
    const payload = {
        sender: { name: "LifeDrop AI", email: SENDER_EMAIL },
        to: [{ email: email }],
        subject: "LifeDrop Verification Code",
        htmlContent: `
            <div style="font-family: sans-serif; padding: 30px; border-radius: 20px; background-color: #f8fafc; text-align: center;">
                <h2 style="color: #ef4444; font-size: 24px; font-weight: 900;">LifeDrop 💧</h2>
                <p style="color: #64748b; font-weight: bold;">Verify your account to start saving lives.</p>
                <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 15px; display: inline-block; border: 1px solid #e2e8f0;">
                    <h1 style="letter-spacing: 15px; font-size: 40px; color: #1e293b; margin: 0;">${otp}</h1>
                </div>
                <p style="color: #94a3b8; font-size: 12px;">This code will expire in 10 minutes.</p>
            </div>
        `
    };
    
    const headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    };

    try {
        // Add timeout and keepAlive to prevent ECONNRESET
        const response = await axios.post(url, payload, { 
            headers,
            timeout: 10000, // 10 seconds timeout
            httpsAgent: new (require('https').Agent)({ keepAlive: true })
        });
        
        if (response.status <= 202) {
            console.log(`✅ OTP Sent Successfully to ${email}`);
            return true;
        } else {
            console.log(`❌ Brevo Error: ${response.status} - ${JSON.stringify(response.data)}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Email Error for ${email}: ${error.message}`);
        
        // Special handling for ECONNRESET
        if (error.code === 'ECONNRESET') {
            console.log('🔄 Connection reset detected - retrying once...');
            try {
                // Retry once after 1 second
                await new Promise(resolve => setTimeout(resolve, 1000));
                const retryResponse = await axios.post(url, payload, { headers });
                if (retryResponse.status <= 202) {
                    console.log(`✅ OTP Sent Successfully to ${email} (retry)`);
                    return true;
                }
            } catch (retryError) {
                console.log(`❌ Retry also failed: ${retryError.message}`);
            }
        }
        
        // Fallback - log OTP to console for development
        console.log(`📧 FALLBACK - OTP for ${email}: ${otp}`);
        return false;
    }
}

// Send Request Alert Email
async function sendRequestAlertEmail(donorEmail, donorName, reqDetails) {
    const url = "https://api.brevo.com/v3/smtp/email";
    const headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    };
    
    const payload = {
        sender: { name: "LifeDrop Urgent 🚨", email: SENDER_EMAIL },
        to: [{ email: donorEmail }],
        subject: `URGENT: Blood Needed for ${reqDetails.patient}`,
        htmlContent: `
            <div style="font-family: sans-serif; padding: 20px; border: 2px solid #ef4444; border-radius: 15px;">
                <h2 style="color: #ef4444;">Emergency Help Request! 🩸</h2>
                <p>Hello <b>${donorName}</b>, a requester needs your help immediately.</p>
                <hr/>
                <p><b>Patient Name:</b> ${reqDetails.patient}</p>
                <p><b>Blood Group:</b> ${reqDetails.blood}</p>
                <p><b>Hospital:</b> ${reqDetails.hospital}</p>
                <p><b>Requester Name:</b> ${reqDetails.requester}</p>
                <p><b>Contact Phone:</b> <a href="tel:${reqDetails.phone}">${reqDetails.phone}</a></p>
                <hr/>
                <p style="font-size: 12px; color: #666;">Please login to your dashboard to Accept/Decline this request.</p>
            </div>
        `
    };
    
    try {
        await axios.post(url, payload, { headers });
    } catch (error) {
        console.log(`❌ Request Alert Email Error: ${error.message}`);
    }
}

// Send Cooldown Completion Email
async function sendCooldownCompletionEmail(donorEmail, donorName) {
    const url = "https://api.brevo.com/v3/smtp/email";
    const headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    };
    
    const payload = {
        sender: { name: "LifeDrop AI", email: SENDER_EMAIL },
        to: [{ email: donorEmail }],
        subject: "Hero, You are Eligible to Donate Again! 🎖️",
        htmlContent: `
            <div style="font-family: sans-serif; padding: 20px; text-align: center; background: #f0fdf4; border-radius: 20px;">
                <h2 style="color: #16a34a;">Welcome Back, Hero!</h2>
                <p>Hello <b>${donorName}</b>, your 90-day recovery period is officially complete.</p>
                <div style="font-size: 50px;">🩸</div>
                <p>Your body is ready to save another life. Your status is now <b>ACTIVE</b> on the LifeDrop map.</p>
                <p>Thank you for being a part of this mission.</p>
            </div>
        `
    };
    
    try {
        await axios.post(url, payload, { headers });
    } catch (error) {
        console.log(`❌ Cooldown Email Error: ${error.message}`);
    }
}

// Initialize Inventory
async function initInventory() {
    const groups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    
    for (const g of groups) {
        const exists = await BloodInventory.findOne({ blood_group: g });
        if (!exists) {
            await BloodInventory.create({
                blood_group: g,
                units: 0,
                last_updated: new Date()
            });
        }
    }
    console.log('🩸 Blood Inventory Initialized');
}

// Calculate Distance (Haversine Formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Generate Unique ID
async function generateUniqueId(model) {
    while (true) {
        const newId = Math.floor(1000 + Math.random() * 9000).toString();
        const exists = await model.findOne({ unique_id: newId });
        if (!exists) {
            return newId;
        }
    }
}

// Calculate Hash for Blockchain
function calculateHash(index, prevHash, timestamp, data) {
    const value = index + prevHash + timestamp + data;
    return crypto.createHash('sha256').update(value).digest('hex');
}

// ✅ UPDATED: Added 'creatorId' parameter for forensics
async function addBlockchainBlock(requestId, event, dataDict, creatorId) {
    try {
        // 1. Fetch the last block to get the previous hash and index
        const lastBlock = await BlockchainLedger.findOne().sort({ index: -1 });
        
        const prevHash = lastBlock ? lastBlock.current_hash : "0";
        const newIndex = lastBlock ? lastBlock.index + 1 : 1;
        const timestamp = new Date();

        // 2. ✅ ENRICH DATA: Add creator ID to the data dictionary
        // Idhu thaan "Who did this" nu blockchain kulla record pannum
        const enrichedData = { 
            ...dataDict, 
            creator: creatorId || "SYSTEM" 
        };
        const dataJson = JSON.stringify(enrichedData);

        // 3. CALCULATE HASH
        // Order: index + prevHash + timestamp + data
        const hashInput = newIndex + prevHash + timestamp.toISOString() + dataJson;
        const newHash = crypto.createHash('sha256').update(hashInput).digest('hex');

        // 4. SAVE TO DATABASE
        await BlockchainLedger.create({
            index: newIndex,
            request_id: requestId.toString(),
            event: event,
            data: dataJson,
            previous_hash: prevHash,
            current_hash: newHash,
            timestamp: timestamp
        });

        console.log(`🔗 Blockchain: Block #${newIndex} added for Event: ${event}`);
    } catch (error) {
        console.error("❌ Blockchain Error:", error);
    }
}

// 1. Helper: Fetch All Unique User Emails
const getAllUserEmails = async () => {
    try {
        const donors = await Donor.find({}, 'email');
        const requesters = await Requester.find({}, 'email');
        const emails = [...donors.map(d => d.email), ...requesters.map(r => r.email)];
        return [...new Set(emails)]; // Duplicate emails-ah remove panna
    } catch (error) {
        console.error("Error fetching emails:", error);
        return [];
    }
};

// 2. Helper: Send Bulk Email via Brevo
const sendBulkEmail = async (emails, subject, htmlContent) => {
    if (emails.length === 0) return;

    const url = "https://api.brevo.com/v3/smtp/email";
    const payload = {
        "sender": { "name": "LifeDrop Official 💧", "email": "lifedrop108@gmail.com" },
        "to": emails.map(email => ({ "email": email })),
        "subject": subject,
        "htmlContent": htmlContent
    };

    try {
        await axios.post(url, payload, {
            headers: {
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json"
            }
        });
        console.log(`✅ Bulk Email Sent to ${emails.length} users`);
    } catch (error) {
        console.error("❌ Bulk Email Error:", error.response ? error.response.data : error.message);
    }
};

const logSecurityEvent = async (req, userId, email, action) => {
    try {
        const newLog = new AuditLog({
            user_id: userId,
            email: email,
            action: action,
            // Render-la real IP kedaikka x-forwarded-for check panroam
            ip_address: req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress,
            device_info: req.headers['user-agent']
        });
        await newLog.save();
        console.log(`🛡️ Security Log: ${action} by ${email}`);
    } catch (err) {
        console.error("Logging Error:", err);
    }
};

// ==================== ROUTES ====================

// Home Route
app.get('/', (req, res) => {
    res.json({
        status: "online",
        message: "LifeDrop Backend is running 🚀 (Node.js Version)",
        version: "1.0.0",
        database: "MongoDB"
    });
});

// Register Donor
// ==================== REGISTER DONOR (CORRECTED) ====================
app.post('/register/donor', async (req, res) => {
    try {
        const data = req.body;
        
        // 1. Check if email already exists
        const existingUser = await Donor.findOne({ email: data.email }) || await Requester.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).json({ message: "This email is already registered, you may login or use different email" });
        }

        // 2. ✅ MUKKIYAM: OTP check-ah user create pandrathuku MUNNADIYE pannanum
        const otpRecord = await OTPVerification.findOne({ email: data.email });
        if (!otpRecord) {
            return res.status(400).json({ message: "Email not verified. Please verify OTP first." });
        }
        
        // 3. Generate ID and Hash Password
        const uId = await generateUniqueId(Donor);
        const hashedPw = await bcrypt.hash(data.password, 10);
        
        // 4. Create User (Ippo thaan save pannanum)
        await Donor.create({
            unique_id: uId,
            full_name: data.fullName,
            phone: data.phone,
            email: data.email,
            password: hashedPw,
            blood_group: data.bloodGroup,
            dob: data.dob,
            lat: data.lat,
            lng: data.lng,
            health_score: data.healthScore,
            last_donation_date: null,
            donation_count: 0,
            cooldown_email_sent: false,
            is_available: true,
            community: data.community, // 'Public' or 'Periyar University'
            department: data.department || null,
            role_type: data.roleType || null,
            year: data.year || null,
            id_card_image: data.id_card_image,
            is_verified: data.community === "Public" ? true : false,
            created_at: new Date()
        });

        // 5. Cleanup OTP
        await OTPVerification.deleteMany({ email: data.email });
        
        res.status(201).json({ message: "Donor Registered Successfully", unique_id: uId });
    } catch (error) {
        console.error('Donor Registration Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ==================== REGISTER REQUESTER (CORRECTED) ====================
app.post('/register/requester', async (req, res) => {
    try {
        const data = req.body;
        
        // 1. Check if email already exists
        const existingUser = await Requester.findOne({ email: data.email }) || await Donor.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).json({ message: "This email is already registered, you may login or use different email" });
        }

        // 2. ✅ MUKKIYAM: OTP check-ah user create pandrathuku MUNNADIYE pannanum
        const otpRecord = await OTPVerification.findOne({ email: data.email });
        if (!otpRecord) {
            return res.status(400).json({ message: "Email not verified. Please verify OTP first." });
        }
        
        // 3. Generate ID and Hash Password
        const uId = await generateUniqueId(Requester);
        const hashedPw = await bcrypt.hash(data.password, 10);
        
        // 4. Create User
        await Requester.create({
            unique_id: uId,
            full_name: data.fullName,
            phone: data.phone,
            email: data.email,
            password: hashedPw,
            community: data.community,
            department: data.department,
            role_type: data.roleType,
            year: data.year,
            is_verified: data.community === "Public" ? true : data.is_verified,
            created_at: new Date()
        });

        // 5. Cleanup OTP
        await OTPVerification.deleteMany({ email: data.email });
        
        res.status(201).json({ message: "Success", unique_id: uId });
    } catch (error) {
        console.error('Requester Registration Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// 1. Get all University Donors waiting for verification
app.get('/api/admin/pending-verifications', async (req, res) => {
    try {
        const pending = await Donor.find({ 
            community: "Periyar University", 
            is_verified: false 
        });
        res.json(pending);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending list" });
    }
});

// app.js kulla approve-donor route-ah update pannunga
app.post('/api/admin/approve-donor/:u_id', async (req, res) => {
    try {
        const { u_id } = req.params;

        // ✅ UPDATE LOGIC: Verify pannittu image-ah thookiduroam
        const result = await Donor.updateOne(
            { unique_id: u_id }, 
            { 
                $set: { 
                    is_verified: true,
                    id_card_image: null // 🗑️ Image deleted from DB to save space & privacy
                } 
            }
        );

        if (result.matchedCount > 0) {
            res.json({ success: true, message: "Donor Verified & ID Image Purged for Privacy!" });
        } else {
            res.status(404).json({ message: "Donor not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Approval failed" });
    }
});

app.post('/api/verify-id-gemini', async (req, res) => {
    try {
        let { imageBase64 } = req.body;
        if (imageBase64.includes(',')) {
            imageBase64 = imageBase64.split(',')[1];
        }

        // ✅ UPDATED STRICT PROMPT
        const prompt = `
        You are a strict security auditor for Periyar University, Salem.
        Analyze this ID card image very carefully.
        
        STRICT RULES:
        1. The card MUST be from the main 'PERIYAR UNIVERSITY' campus in Salem.
        2. If the card belongs to an affiliated college like 'AVS Arts & Science', 'Mahendra', 'Sona', or any other college name, you MUST set is_valid to FALSE.
        3. Look for the specific header 'PERIYAR UNIVERSITY' and the location 'SALEM'.
        4. Check if it is a 'Student' or 'Staff' card.

        Answer ONLY in this JSON format: 
        {
          "is_valid": true/false, 
          "role": "Student/Staff", 
          "reason": "Why you accepted or rejected it"
        }
        `;

        const payload = {
            contents: [{
                parts: [
                    { text: prompt },
                    { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }
                ]
            }]
        };

        const response = await axios.post(GEMINI_URL, payload);
        const resultText = response.data.candidates[0].content.parts[0].text;
        const cleanJson = resultText.replace(/```json|```/g, "").trim();
        const result = JSON.parse(cleanJson);

        console.log("🤖 AI Audit Result:", result); // Debugging-ku useful-ah irukkum

        res.json(result);
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ message: "AI Verification failed" });
    }
});

// Send OTP - FIXED VERSION
app.post('/api/verify/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        
        const donorExists = await Donor.findOne({ email });
        const requesterExists = await Requester.findOne({ email });
        
        if (donorExists || requesterExists) {
            return res.status(400).json({
                success: false,
                message: "This email is already registered, you may login or use different email"
            });
        }
        
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        
        await OTPVerification.deleteMany({ email });
        await OTPVerification.create({
            email: email,
            otp: otpCode,
            timestamp: new Date()
        });
        
        // Send email securely with await
        try {
            const sent = await sendBrevoOTP(email, otpCode);
            if (sent) {
                console.log(`✅ Email sent successfully to ${email}`);
            } else {
                console.log(`⚠️ Email sending had issues, but OTP saved in DB for ${email}`);
            }
        } catch (err) {
            console.error(`❌ Email promise error: ${err.message}`);
        }
        
        // Always return success to user - OTP is in DB
        res.json({ 
            success: true,
            message: "OTP sent to your email! If not received, check spam or use code from console." 
        });
        
    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error" 
        });
    }
});

// Check OTP - FIXED VERSION
app.post('/api/check-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        console.log(`Checking DB for Email: ${email} | User Input: ${otp}`);
        
        const record = await OTPVerification.findOne({ email, otp });
        
        if (record) {
            // OTP correct - delete it so it can't be reused
            
            console.log(`✅ OTP verified successfully for ${email}`);
            res.json({ success: true });
        } else {
            console.log(`❌ Invalid OTP for ${email}`);
            res.status(400).json({ success: false, message: "Invalid or Expired OTP!" });
        }
    } catch (error) {
        console.error('Check OTP Error:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Login
app.post('/login', loginLimiter, async (req, res) => {
    try {
        const ipAddr = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
        
        // 1. Check if IP is blocked by penalty system
        const { allowed, message } = await checkLoginBlock(ipAddr);
        if (!allowed) {
            await logSecurityEvent(req, "BLOCKED_IP", "N/A", "LOGIN_ATTEMPT_WHILE_BLOCKED");
            return res.status(429).json({ success: false, message });
        }
        
        const { email, password, role } = req.body;
        
        // 2. ADMIN LOGIN CHECK
        if (email === "lifedrop108@gmail.com" && password === "lifedrop123") {
            // ✅ LOG SUCCESSFUL ADMIN LOGIN
            await logSecurityEvent(req, "ADMIN", email, "ADMIN_LOGIN_SUCCESS");
            
            return res.json({
                message: "Admin Login Success",
                user: {
                    name: "Super Admin",
                    role: "admin",
                    unique_id: "ADMIN",
                    email: email
                }
            });
        }
        
        // 3. REGULAR USER CHECK (Donor/Requester)
        let user = null;
        if (role === 'donor') {
            user = await Donor.findOne({ email });
        } else {
            user = await Requester.findOne({ email });
        }
        
        // 4. PASSWORD VERIFICATION
        if (user && await bcrypt.compare(password, user.password)) {
            // Login Success - Clear penalty attempts
            await LoginAttempt.deleteOne({ ip: ipAddr });
            
            // ✅ LOG SUCCESSFUL USER LOGIN
            await logSecurityEvent(req, user.unique_id, email, `USER_LOGIN_SUCCESS_${role.toUpperCase()}`);
            
            const responseData = {
                message: "Login Success",
                user: {
                    name: user.full_name,
                    email: user.email,
                    role: role,
                    unique_id: user.unique_id,
                    bloodGroup: user.blood_group || "",
                    community: user.community || "Public",
                    department: user.department || "",
                    is_verified: user.is_verified // University status-ku
                }
            };
            
            res.json(responseData);
        } else {
            // 5. LOGIN FAILED
            await logFailedAttempt(ipAddr);
            
            // ✅ LOG FAILED ATTEMPT FOR FORENSICS
            await logSecurityEvent(req, "UNKNOWN", email || "N/A", "LOGIN_FAILED_INVALID_CREDENTIALS");
            
            res.status(401).json({ message: "Invalid Credentials" });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        const donor = await Donor.findOne({ email });
        const requester = await Requester.findOne({ email });
        
        if (!donor && !requester) {
            return res.status(404).json({ message: "User with this email does not exist!" });
        }
        
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        
        await OTPVerification.deleteMany({ email });
        await OTPVerification.create({
            email: email,
            otp: otpCode,
            timestamp: new Date()
        });
        
        sendBrevoOTP(email, otpCode);
        
        res.json({ message: "Reset OTP sent to your email!" });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email, otp, new_password } = req.body;
        
        // OTP Verification
        const record = await OTPVerification.findOne({ email, otp });
        
        if (!record) {
            return res.status(400).json({ success: false, message: "Invalid or Expired OTP!" });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(new_password, 10);
        
        // Update in Donors first
        let donorResult = await Donor.updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );
        
        let updateDone = false;
        
        if (donorResult.modifiedCount > 0) {
            updateDone = true;
        } else {
            // Try Requester
            let reqResult = await Requester.updateOne(
                { email },
                { $set: { password: hashedPassword } }
            );
            if (reqResult.modifiedCount > 0) {
                updateDone = true;
            }
        }
        
        if (updateDone) {
            await OTPVerification.deleteOne({ _id: record._id });
            res.json({ success: true, message: "Password updated successfully!" });
        } else {
            res.status(404).json({ success: false, message: "User account not found!" });
        }
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get Donor by ID
app.get('/api/donor/:u_id', async (req, res) => {
    try {
        const donor = await Donor.findOne({ unique_id: req.params.u_id });
        
        if (donor) {
            res.json({
                id: donor.unique_id,
                name: donor.full_name,
                bloodGroup: donor.blood_group,
                healthScore: donor.health_score,
                phone: donor.phone,
                dob: donor.dob,
                email: donor.email,
                status: "Verified",
                location: { lat: donor.lat, lng: donor.lng },
                fcm_token: donor.fcm_token // Include FCM token in response
            });
        } else {
            res.status(404).json({ message: "Not Found" });
        }
    } catch (error) {
        console.error('Get Donor Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get('/api/requester/history/:u_id', async (req, res) => {
    try {
        const { u_id } = req.params;
        const requests = await BloodRequest.find({ requester_id: u_id }).sort({ timestamp: -1 });
        
        const output = [];
        for (let r of requests) {
            let assignedDonorInfo = null;
            
            // ✅ FIX: r._id-ah string-ah mathi notification-la search panroam
            const notif = await Notification.findOne({ request_id: r._id.toString() });
            
            // Debugging log (Render logs-la check panna)
            if (notif) {
                console.log(`✅ Found donor for request ${r._id}`);
                const donor = await Donor.findOne({ unique_id: notif.donor_id });
                if (donor) {
                    assignedDonorInfo = {
                        name: donor.full_name,
                        phone: donor.phone,
                        status: notif.status
                    };
                }
            }

            output.push({
                id: r._id.toString(),
                bloodGroup: r.blood_group,
                status: r.status,
                patient: r.patient_name,
                hospital: r.hospital,
                date: r.timestamp.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                assigned_donor: assignedDonorInfo 
            });
        }
        res.json(output);
    } catch (error) {
        console.error("History Error:", error);
        res.status(500).json({ message: "Error" });
    }
});

// Create Blood Request
// app.js kulla intha route-ah replace pannunga nanba
app.post('/api/request/create', async (req, res) => {
    try {
        const data = req.body;
        
        // ✅ FIX 1: Body-lendhu requester_id-ah edukuroam
        const requester_id = data.requester_id;

        if (!requester_id) {
            return res.status(400).json({ message: "Requester ID is missing in request" });
        }

        // 1. Create the request in MongoDB
        const newReq = await BloodRequest.create({
            requester_id: requester_id,
            patient_name: data.patientName,
            contact_number: data.contactNumber,
            blood_group: data.bloodGroup,
            units: data.units,
            urgency: data.urgency,
            hospital: data.hospital,
            lat: data.lat,
            lng: data.lng,
            status: 'Pending',
            created_at: new Date()
        });

        const requestId = newReq._id.toString();

        // 2. ✅ FIX 2: Blockchain-la creatorId-ah requester_id-ah anupuroam
        await addBlockchainBlock(requestId, "Request Initialized", {
            patient: data.patientName,
            group: data.bloodGroup,
            hospital: data.hospital
        }, requester_id);

        // 3. Log the security event
        await logSecurityEvent(req, requester_id, "N/A", "BLOOD_REQUEST_CREATED");

        res.status(201).json({ message: "Request Created Successfully", id: requestId });

    } catch (error) {
        console.error('Create Request Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Match Donors
app.get('/api/match-donors/:request_id', async (req, res) => {
    try {
        let requestId;
        try {
            requestId = new ObjectId(req.params.request_id);
        } catch {
            return res.status(404).json({ message: "Not Found" });
        }
        
        const bloodReq = await BloodRequest.findById(requestId);
        
        if (!bloodReq) {
            return res.status(404).json({ message: "Not Found" });
        }
        
        // ✅ FIX 1: Get requester details
        const requester = await Requester.findOne({ unique_id: bloodReq.requester_id });
        if (!requester) {
            return res.status(404).json({ message: "Requester not found" });
        }
        
        const allowedDonorGroups = BLOOD_COMPATIBILITY[bloodReq.blood_group] || [bloodReq.blood_group];
        const cooldownLimit = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        
        // ✅ FIX 2: Community filter - STRICT ISOLATION
        const query = {
            blood_group: { $in: allowedDonorGroups },
            is_available: true,
            community: requester.community, // 🎯 Public only sees Public, PU only sees PU
            $or: [
                { last_donation_date: null },
                { last_donation_date: { $lte: cooldownLimit } }
            ]
        };
        if (requester.community === "Periyar University") {
            query.is_verified = true;
        }
        
        const donors = await Donor.find(query);
        
        const matches = [];
        
        for (const d of donors) {
            const rawPhone = d.phone;
            const maskedPhone = rawPhone.length > 4 
                ? rawPhone.substring(0, 2) + "******" + rawPhone.substring(rawPhone.length - 2)
                : rawPhone;
            
            const dist = calculateDistance(bloodReq.lat, bloodReq.lng, d.lat, d.lng);
            const distScore = Math.max(0, 100 - (dist * 2));
            
            const isExact = (d.blood_group === bloodReq.blood_group);
            let matchPercent = (distScore * 0.6) + (d.health_score * 0.4);
            if (isExact) {
                matchPercent += 5;
            }
            
            const finalMatch = Math.min(Math.round(matchPercent), 100);
            
            matches.push({
                unique_id: d.unique_id,
                name: d.full_name,
                distance: Math.round(dist * 10) / 10,
                healthScore: d.health_score,
                match: finalMatch,
                phone: maskedPhone,
                blood: d.blood_group,
                lat: d.lat,
                lng: d.lng,
                isExact: isExact
            });
        }
        
        matches.sort((a, b) => b.match - a.match);
        
        res.json({
            request: {
                lat: bloodReq.lat,
                lng: bloodReq.lng,
                blood: bloodReq.blood_group,
                community: requester.community // Show community for debugging
            },
            matches: matches
        });
    } catch (error) {
        console.error('Match Donors Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.post('/api/send-request', async (req, res) => {
    try {
        const data = req.body;
        
        // 1. Check if notification already exists (Using String ID)
        const exists = await Notification.findOne({
            donor_id: data.donor_id,
            request_id: data.request_id // Direct string match
        });
        
        if (!exists) {
            const donor = await Donor.findOne({ unique_id: data.donor_id });
            const bloodReq = await BloodRequest.findById(data.request_id);

            if (!donor || !bloodReq) {
                return res.status(404).json({ message: "Donor or Request not found" });
            }

            const requester = await Requester.findOne({ unique_id: bloodReq.requester_id });
            
            // 2. Create Notification (Store request_id as String)
            await Notification.create({
                donor_id: data.donor_id,
                request_id: data.request_id, // ✅ Stored as String
                status: "Pending",
                created_at: new Date()
            });
            
            const reqDetails = {
                patient: bloodReq.patient_name,
                blood: bloodReq.blood_group,
                hospital: bloodReq.hospital,
                requester: requester ? requester.full_name : "N/A",
                phone: bloodReq.contact_number
            };
            
            sendRequestAlertEmail(donor.email, donor.full_name, reqDetails);
            
            return res.status(201).json({ message: "Request sent successfully!" });
        } else {
            return res.json({ message: "Request already sent to this donor" });
        }
    } catch (error) {
        console.error('Send Request Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get Donor Profile Stats
app.get('/api/donor/profile-stats/:u_id', async (req, res) => {
    try {
        const donor = await Donor.findOne({ unique_id: req.params.u_id });
        
        if (!donor) {
            return res.status(404).json({ message: "Donor not found" });
        }
        
        let daysRemaining = 0;
        let isResting = false;
        
        if (donor.last_donation_date) {
            const now = new Date();
            const lastDonation = new Date(donor.last_donation_date);
            const daysPassed = Math.floor((now - lastDonation) / (1000 * 60 * 60 * 24));
            
            if (daysPassed < 90) {
                daysRemaining = 90 - daysPassed;
                isResting = true;
            }
        }
        
        res.json({
            donation_count: donor.donation_count || 0,
            is_available: donor.is_available,
            days_remaining: daysRemaining,
            is_resting: isResting,
            is_verified: donor.is_verified, 
            community: donor.community,
            department: donor.department
        });
    } catch (error) {
        console.error('Donor Stats Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Toggle Donor Status
app.post('/api/donor/toggle-status/:u_id', async (req, res) => {
    try {
        const donor = await Donor.findOne({ unique_id: req.params.u_id });
        
        if (donor) {
            const newStatus = !donor.is_available;
            await Donor.updateOne(
                { unique_id: req.params.u_id },
                { $set: { is_available: newStatus } }
            );
            
            res.json({
                message: "Status Updated",
                is_available: newStatus
            });
        } else {
            res.status(404).json({ message: "Donor not found" });
        }
    } catch (error) {
        console.error('Toggle Status Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get Targeted Alerts for Donor
app.get('/api/donor/targeted-alerts/:u_id', async (req, res) => {
    try {
        const notifications = await Notification.find({ donor_id: req.params.u_id });
        
        const output = [];
        
        for (const n of notifications) {
            const bloodReq = await BloodRequest.findById(n.request_id);
            if (bloodReq) {
                output.push({
                    notif_id: n._id.toString(),
                    request_id: bloodReq._id.toString(),
                    patient: bloodReq.patient_name,
                    hospital: bloodReq.hospital,
                    blood: bloodReq.blood_group,
                    urgency: bloodReq.urgency,
                    phone: bloodReq.contact_number,
                    status: n.status,
                    date: bloodReq.timestamp.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                });
            }
        }
        
        res.json(output);
    } catch (error) {
        console.error('Targeted Alerts Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Respond to Request (Accept/Decline)
app.post('/api/notif/respond', async (req, res) => {
    try {
        const data = req.body;
        
        let notif;
        try {
            notif = await Notification.findById(data.notif_id);
        } catch {
            return res.status(404).json({ message: "Not found" });
        }
        
        if (notif) {
            await Notification.updateOne(
                { _id: notif._id },
                { $set: { status: data.status } }
            );
            
            const bloodReq = await BloodRequest.findById(notif.request_id);
            if (bloodReq) {
                let newStatus = bloodReq.status;
                if (data.status === 'Accepted') {
                    newStatus = 'Accepted';
                } else if (data.status === 'Declined') {
                    newStatus = 'Rejected';
                }
                
                await BloodRequest.updateOne(
                    { _id: bloodReq._id },
                    { $set: { status: newStatus } }
                );
            }
            
            await addBlockchainBlock(notif.request_id.toString(), "Donor Accepted Request", {
                donor_id: notif.donor_id,
                time: new Date().toISOString()
            }, notif.donor_id); // ✅ Added donor_id as creator
            
            res.json({ message: `Request ${data.status}` });
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        console.error('Respond to Request Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Submit Donation
// app.js kulla intha route-ah update pannunga nanba
app.post('/api/notif/donate', async (req, res) => {
    try {
        const { notif_id, bag_id } = req.body;
        
        // 1. Find the notification
        const notif = await Notification.findById(notif_id);
        if (!notif) return res.status(404).json({ message: "Notification not found" });

        // 2. Find the donor to get their name and update stats
        const donor = await Donor.findOne({ unique_id: notif.donor_id });
        if (!donor) return res.status(404).json({ message: "Donor not found" });

        // 3. Update Notification Status
        notif.status = 'Donated';
        notif.blood_bag_id = bag_id;
        await notif.save();

        // 4. Update Donor Cooldown & Count
        donor.last_donation_date = new Date();
        donor.donation_count += 1;
        donor.cooldown_email_sent = false; // Reset for next reminder
        await donor.save();

        // 5. Update Main Blood Request Status
        const bloodReq = await BloodRequest.findById(notif.request_id);
        if (bloodReq) {
            bloodReq.status = 'On the way';
            await bloodReq.save();
        }

        // ✅ FIX: BLOCKCHAIN RECORD (Ensuring all 4 parameters are correct)
        // requestId, event, dataDict, creatorId
        await addBlockchainBlock(
            notif.request_id.toString(), 
            "Blood Bag Dispatched", 
            { 
                bag_id: bag_id, 
                donor_name: donor.full_name,
                hospital: bloodReq ? bloodReq.hospital : "N/A"
            }, 
            notif.donor_id // This is the creatorId (Donor)
        );

        // 6. Log the security event
        await logSecurityEvent(req, notif.donor_id, donor.email, "BLOOD_DONATION_DISPATCHED");

        res.json({ success: true, message: "Donation recorded and Blockchain updated!" });

    } catch (error) {
        console.error('Donation Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Complete Request
app.post('/api/request/complete/:req_id', async (req, res) => {
    try {
        let reqId;
        try {
            reqId = new ObjectId(req.params.req_id);
        } catch {
            return res.status(404).json({ message: "Error" });
        }
        
        const bloodReq = await BloodRequest.findById(reqId);
        const requester_id = bloodReq.requester_id;
        
        if (bloodReq) {
            await BloodRequest.updateOne(
                { _id: bloodReq._id },
                { $set: { status: 'Completed' } }
            );
            
            await Notification.updateMany(
                { request_id: bloodReq._id },
                { $set: { status: 'Completed' } }
            );
            
            await addBlockchainBlock(req.params.req_id, "Blood Received & Process Completed", {
                status: "Life Saved ✅"
            }, requester_id);
            
            res.json({ message: "Process Completed!" });
        } else {
            res.status(404).json({ message: "Error" });
        }
    } catch (error) {
        console.error('Complete Request Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get Admin Stats
app.get('/api/admin/stats', async (req, res) => {
    try {
        const totalDonors = await Donor.countDocuments();
        const totalRequesters = await Requester.countDocuments();
        const totalRequests = await BloodRequest.countDocuments();
        const pendingRequests = await BloodRequest.countDocuments({ status: 'Pending' });
        const completedRequests = await BloodRequest.countDocuments({ status: 'Completed' });
        
        const recentReqs = await BloodRequest.find()
            .sort({ timestamp: -1 })
            .limit(10);
        
        const recentData = recentReqs.map(r => ({
            id: r._id.toString(),
            patient: r.patient_name,
            blood: r.blood_group,
            status: r.status,
            hospital: r.hospital
        }));
        
        res.json({
            stats: {
                donors: totalDonors,
                requesters: totalRequesters,
                total_reqs: totalRequests,
                pending: pendingRequests,
                completed: completedRequests
            },
            recent: recentData
        });
    } catch (error) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// app.js kulla intha route-ah add pannunga
app.get('/api/admin/audit-logs', async (req, res) => {
    try {
        // Latest logs-ah mela kaatta sort({ timestamp: -1 }) panroam
        const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching security logs" });
    }
});

// Get All Users (Admin)
app.get('/api/admin/all-users', async (req, res) => {
    try {
        const users = [];
        
        const donors = await Donor.find();
        for (const d of donors) {
            users.push({
                name: d.full_name,
                email: d.email,
                role: "Donor",
                phone: d.phone,
                fcm_token: d.fcm_token ? "Present" : "Not Set" // Show token status
            });
        }
        
        const requesters = await Requester.find();
        for (const r of requesters) {
            users.push({
                name: r.full_name,
                email: r.email,
                role: "Requester",
                phone: r.phone
            });
        }
        
        res.json(users);
    } catch (error) {
        console.error('All Users Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get Donors Detailed (Admin)
app.get('/api/admin/donors-detailed', async (req, res) => {
    try {
        const donors = await Donor.find();
        const cooldownLimit = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        
        const output = donors.map(d => {
            const isActive = !d.last_donation_date || d.last_donation_date <= cooldownLimit;
            return {
                id: d._id.toString(),
                u_id: d.unique_id,
                name: d.full_name,
                email: d.email,
                blood: d.blood_group,
                donations: d.donation_count || 0,
                health: d.health_score,
                phone: d.phone,
                location: `${d.lat.toFixed(2)}, ${d.lng.toFixed(2)}`,
                status: isActive ? "Active" : "Inactive",
                push_enabled: d.fcm_token ? "Yes" : "No" // Show push notification status
            };
        });
        
        res.json(output);
    } catch (error) {
        console.error('Donors Detailed Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get Requests Detailed (Admin)
app.get('/api/admin/requests-detailed', async (req, res) => {
    try {
        const reqType = req.query.type;
        let query = {};
        
        if (reqType === 'active') {
            query = { status: { $ne: 'Completed' } };
        } else if (reqType === 'completed') {
            query = { status: 'Completed' };
        }
        
        const requests = await BloodRequest.find(query);
        
        const output = [];
        
        for (const r of requests) {
            const reqUser = await Requester.findOne({ unique_id: r.requester_id });
            
            let donorName = "N/A";
            if (reqType === 'completed') {
                const successNotif = await Notification.findOne({
                    request_id: r._id,
                    status: 'Completed'
                });
                if (successNotif) {
                    const donorUser = await Donor.findOne({ unique_id: successNotif.donor_id });
                    if (donorUser) {
                        donorName = donorUser.full_name;
                    }
                }
            }
            
            output.push({
                id: r._id.toString(),
                patient: r.patient_name,
                blood: r.blood_group,
                requester: reqUser ? reqUser.full_name : "N/A",
                donor: donorName,
                hospital: r.hospital,
                phone: r.contact_number,
                status: r.status
            });
        }
        
        res.json(output);
    } catch (error) {
        console.error('Requests Detailed Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Create Broadcast (Admin)
app.post('/api/admin/broadcast', async (req, res) => {
    try {
        const data = req.body;
        
        // DB-la broadcast save panroam
        await Broadcast.create({
            message: data.message,
            timestamp: new Date()
        });

        // --- BULK MAIL LOGIC ---
        const emails = await getAllUserEmails();
        const mailContent = `
            <div style="font-family: sans-serif; padding: 20px; background: #fef2f2; border-radius: 20px; border: 1px solid #fee2e2; max-width: 600px; margin: auto;">
                <h2 style="color: #dc2626; margin-bottom: 15px;">Emergency Alert 📢</h2>
                <p style="font-size: 16px; color: #1e293b; line-height: 1.6; font-weight: bold;">
                    ${data.message}
                </p>
                <hr style="border: 0; border-top: 1px solid #fecaca; margin: 20px 0;"/>
                <p style="font-size: 11px; color: #94a3b8; text-align: center;">
                    This is an official emergency broadcast from the LifeDrop Admin Team.
                </p>
            </div>
        `;

        sendBulkEmail(emails, "LifeDrop Emergency Alert!", mailContent);
        
        res.status(201).json({ message: "Broadcast sent & Emails Dispatched!" });
    } catch (error) {
        console.error('Create Broadcast Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get All Broadcasts
app.get('/api/broadcasts', async (req, res) => {
    try {
        const broadcasts = await Broadcast.find().sort({ timestamp: -1 });
        
        const output = broadcasts.map(b => ({
            id: b._id.toString(),
            message: b.message
        }));
        
        res.json(output);
    } catch (error) {
        console.error('Get Broadcasts Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete Broadcast (Admin)
app.delete('/api/broadcast/delete/:id', async (req, res) => {
    try {
        const result = await Broadcast.deleteOne({ _id: new ObjectId(req.params.id) });
        
        if (result.deletedCount > 0) {
            res.json({ message: "Broadcast deleted!" });
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        console.error('Delete Broadcast Error:', error);
        res.status(404).json({ message: "Not found" });
    }
});

// Get Inventory
app.get('/api/admin/inventory', async (req, res) => {
    try {
        const inventory = await BloodInventory.find();
        
        const output = inventory.map(i => ({
            group: i.blood_group,
            units: i.units,
            updated: i.last_updated.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        }));
        
        res.json(output);
    } catch (error) {
        console.error('Get Inventory Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update Inventory (Admin)
app.post('/api/admin/inventory/update', async (req, res) => {
    try {
        const data = req.body;
        
        const item = await BloodInventory.findOne({ blood_group: data.group });
        
        if (item) {
            let newUnits = item.units;
            
            if (data.action === 'add') {
                newUnits = item.units + 1;
            } else if (data.action === 'sub' && item.units > 0) {
                newUnits = item.units - 1;
            }
            
            await BloodInventory.updateOne(
                { _id: item._id },
                { $set: {
                    units: newUnits,
                    last_updated: new Date()
                }}
            );
            
            res.json({ message: "Inventory updated!" });
        } else {
            res.status(404).json({ message: "Group not found" });
        }
    } catch (error) {
        console.error('Update Inventory Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get Analytics (Admin)
app.get('/api/admin/analytics', async (req, res) => {
    try {
        const groups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
        
        // Donor Distribution
        const donorStats = {};
        for (const g of groups) {
            donorStats[g] = await Donor.countDocuments({ blood_group: g });
        }
        
        // Request Distribution
        const reqStats = {};
        for (const g of groups) {
            reqStats[g] = await BloodRequest.countDocuments({ blood_group: g });
        }
        
        // Save Distribution
        const saveStats = {};
        for (const g of groups) {
            saveStats[g] = await BloodRequest.countDocuments({
                blood_group: g,
                status: 'Completed'
            });
        }
        
        const totalDonors = await Donor.countDocuments();
        const totalRequests = await BloodRequest.countDocuments();
        const totalSaves = await BloodRequest.countDocuments({ status: 'Completed' });
        
        res.json({
            labels: groups,
            donors: groups.map(g => donorStats[g]),
            requests: groups.map(g => reqStats[g]),
            saves: groups.map(g => saveStats[g]),
            total_donors: totalDonors,
            total_requests: totalRequests,
            total_saves: totalSaves
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Create Blood Camp (Admin)
app.post('/api/admin/camps/create', async (req, res) => {
    try {
        const data = req.body;
        
        // DB-la camp save panroam
        const newCamp = await BloodCamp.create({
            title: data.title,
            location: data.location,
            city: data.city,
            date: data.date,
            time: data.time,
            organizer: "LifeDrop Official",
            created_at: new Date()
        });
        
        // Automatic-ah broadcast message create panroam
        const broadcastMsg = `New Donation Camp: ${data.title} at ${data.city} on ${data.date}`;
        await Broadcast.create({
            message: broadcastMsg,
            timestamp: new Date()
        });

        // --- BULK MAIL LOGIC ---
        const emails = await getAllUserEmails();
        const mailContent = `
            <div style="font-family: sans-serif; padding: 20px; border: 2px solid #ef4444; border-radius: 20px; max-width: 600px; margin: auto;">
                <h2 style="color: #ef4444; text-align: center;">New Donation Camp! 🎪</h2>
                <p>Hello Hero, a new blood donation drive has been scheduled in your region.</p>
                <div style="background: #f8fafc; padding: 20px; border-radius: 15px; border: 1px solid #e2e8f0;">
                    <p style="margin: 5px 0;"><b>Event:</b> ${data.title}</p>
                    <p style="margin: 5px 0;"><b>Location:</b> ${data.location}, ${data.city}</p>
                    <p style="margin: 5px 0;"><b>Date:</b> ${data.date}</p>
                    <p style="margin: 5px 0;"><b>Time:</b> ${data.time}</p>
                </div>
                <p style="margin-top: 20px; text-align: center; font-weight: bold; color: #1e293b;">
                    Join us and be the reason for someone's heartbeat. ❤️
                </p>
                <p style="font-size: 10px; color: #94a3b8; text-align: center; margin-top: 30px;">
                    Check the LifeDrop app for more details and directions.
                </p>
            </div>
        `;
        
        // Async-ah mail anupuvom (Response delay aagaama irukka)
        sendBulkEmail(emails, `New Donation Camp: ${data.title}`, mailContent);
        
        res.status(201).json({ message: "Donation Camp Scheduled & Emails Dispatched!" });
    } catch (error) {
        console.error('Create Camp Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// Get All Camps
app.get('/api/camps/all', async (req, res) => {
    try {
        const camps = await BloodCamp.find().sort({ date: 1 });
        
        const output = camps.map(c => ({
            id: c._id.toString(),
            title: c.title,
            location: c.location,
            city: c.city,
            date: c.date,
            time: c.time,
            organizer: c.organizer
        }));
        
        res.json(output);
    } catch (error) {
        console.error('Get Camps Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete Camp (Admin)
app.delete('/api/admin/camps/delete/:id', async (req, res) => {
    try {
        const result = await BloodCamp.deleteOne({ _id: new ObjectId(req.params.id) });
        
        if (result.deletedCount > 0) {
            res.json({ message: "Camp deleted!" });
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        console.error('Delete Camp Error:', error);
        res.status(404).json({ message: "Not found" });
    }
});

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    const inventory = await BloodInventory.find({});
    const stockInfo = inventory.map(i => `${i.blood_group}: ${i.units} units`).join(", ");

    // ✅ NEW PROMPT: Identity is now the FIRST thing AI knows.
    const prompt_context = `
    Your name is 'LifeDrop AI'. You are a proud creation of GOWTHAM G.
    
    WHO IS GOWTHAM G? (Your Creator):
    - GOWTHAM G is a professional Full-stack Developer.
    - He is currently pursuing his MCA (Master of Computer Applications) at Periyar University.
    - He has already completed his BCA degree.
    - His expertise includes: React.js, Node.js, MongoDB, AI Integration, and Blockchain Technology.
    - He built 'LifeDrop' to save lives using modern technology.

    YOUR CORE RULES:
    1. If anyone asks "Who are you?", "Who developed you?", "Who is the owner?", or "Who created this app?", you must answer: "I am LifeDrop AI, developed by GOWTHAM G. He is a brilliant developer currently pursuing MCA at Periyar University."
    2. You should also mention his skills (React, Node, Blockchain) if the user asks for more details about him.
    3. For blood stock queries, use this data: ${stockInfo}.
    4. For any other general questions NOT related to LifeDrop, Health, or Gowtham G, say: "I am specialized in LifeDrop app and health queries only."
    5. Always be friendly and support both Tamil and English.
    `;

    const payload = {
        contents: [{
            parts: [{ text: `${prompt_context}\n\nUser Question: ${message}` }]
        }]
    };

    try {
        const response = await axios.post(GEMINI_URL, payload);
        const botReply = response.data.candidates[0].content.parts[0].text;
        res.json({ reply: botReply });
    } catch (error) {
        res.status(500).json({ reply: "Sorry nanba, I'm having trouble connecting." });
    }
});

// View Blockchain for Request

app.get('/api/blockchain/view/:req_id', async (req, res) => {
    try {
        const { req_id } = req.params;

        // 1. Fetch all blocks for this request, sorted by timestamp
        const blocks = await BlockchainLedger.find({ request_id: req_id }).sort({ timestamp: 1 });
        
        const output = blocks.map((b) => {
            // 2. ✅ INTEGRITY CHECK LOGIC
            // Block create pannum pothu namma enna order-la hash pannomo, athe order-la ippo check panroam
            // Order: index + previous_hash + timestamp + data
            const hashInput = b.index + b.previous_hash + b.timestamp.toISOString() + b.data;
            
            // Re-calculating the hash using SHA-256
            const recalculatedHash = crypto.createHash('sha256').update(hashInput).digest('hex');

            // 3. Compare stored hash with recalculated hash
            // Oru ezhuthu maarunaalum 'is_tampered' true aayidum
            const isTampered = b.current_hash !== recalculatedHash;

            // 4. Parse the data string back to JSON for frontend
            let parsedData;
            try {
                parsedData = JSON.parse(b.data);
            } catch (e) {
                parsedData = b.data;
            }

            return {
                event: b.event,
                data: parsedData,
                prev_hash: b.previous_hash, // Full hash anupuroam audit-ku
                curr_hash: b.current_hash,
                is_tampered: isTampered,    // ✅ Intha flag thaan UI-ah RED-ah mathum
                time: b.timestamp.toLocaleString('en-GB', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                })
            };
        });

        res.json(output);
    } catch (error) {
        console.error('Blockchain Verification Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Check Donor Cooldowns (Admin)
app.get('/api/admin/check-cooldowns', async (req, res) => {
    try {
        const cooldownLimit = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        
        // Find donors who are eligible AND haven't been sent email yet
        const eligibleDonors = await Donor.find({
            last_donation_date: { $lte: cooldownLimit },
            cooldown_email_sent: false,
            last_donation_date: { $ne: null }
        });
        
        console.log(`📧 Found ${eligibleDonors.length} donors eligible for cooldown completion email`);
        
        for (const d of eligibleDonors) {
            sendCooldownCompletionEmail(d.email, d.full_name);
            await Donor.updateOne(
                { _id: d._id },
                { $set: { cooldown_email_sent: true } }
            );
            console.log(`✅ Sent cooldown completion email to ${d.email}`);
        }
        
        res.json({
            message: `Sent ${eligibleDonors.length} reminders!`,
            count: eligibleDonors.length
        });
    } catch (error) {
        console.error('Check Cooldowns Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Contact Form
app.post('/api/contact', async (req, res) => {
    try {
        const data = req.body;
        const userName = data.name;
        const userEmail = data.email;
        const userMsg = data.message;
        
        const url = "https://api.brevo.com/v3/smtp/email";
        const headers = {
            "accept": "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json"
        };
        
        const payload = {
            sender: { name: "LifeDrop System", email: SENDER_EMAIL },
            to: [{ email: "lifedrop108@gmail.com" }],
            subject: `New User Suggestion from ${userName}`,
            htmlContent: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #dc2626;">New Message Received 📩</h2>
                    <p><b>User Name:</b> ${userName}</p>
                    <p><b>User Email:</b> ${userEmail}</p>
                    <hr/>
                    <p><b>Message/Suggestion:</b></p>
                    <p style="background: #f9fafb; padding: 15px; border-radius: 8px;">${userMsg}</p>
                </div>
            `
        };
        
        const response = await axios.post(url, payload, { headers });
        
        if (response.status <= 202) {
            res.json({ message: "Message sent to Admin!" });
        } else {
            res.status(500).json({ message: "Error sending mail" });
        }
    } catch (error) {
        console.error('Contact Form Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// 1. Get All University Donors (Detailed)
app.get('/api/admin/university/donors', async (req, res) => {
    try {
        const donors = await Donor.find({ community: "Periyar University" });
        res.json(donors.map(d => ({
            name: d.full_name,
            email: d.email,
            phone: d.phone,
            blood: d.blood_group,
            dept: d.department,
            role: d.role_type,
            year: d.year || "N/A",
            status: d.is_verified ? "Verified" : "Pending",
            donations: d.donation_count,
            health: d.health_score,
            location: `${d.lat.toFixed(2)}, ${d.lng.toFixed(2)}`
        })));
    } catch (error) { res.status(500).json({ message: "Error" }); }
});

// 2. Get All University Requesters
app.get('/api/admin/university/requesters', async (req, res) => {
    try {
        const reqs = await Requester.find({ community: "Periyar University" });
        res.json(reqs.map(r => ({
            name: r.full_name,
            email: r.email,
            phone: r.phone,
            dept: r.department,
            role: r.role_type,
            year: r.year || "N/A"
        })));
    } catch (error) { res.status(500).json({ message: "Error" }); }
});

// 3. Get University-Only Donation History
app.get('/api/admin/university/history', async (req, res) => {
    try {
        const requests = await BloodRequest.find({ status: 'Completed' }).sort({ timestamp: -1 });
        const output = [];

        for (let r of requests) {
            const requester = await Requester.findOne({ unique_id: r.requester_id });
            // Only pick if requester is from University
            if (requester && requester.community === "Periyar University") {
                const notif = await Notification.findOne({ request_id: r._id, status: 'Completed' });
                const donor = notif ? await Donor.findOne({ unique_id: notif.donor_id }) : null;

                output.push({
                    id: r._id.toString(),
                    patient: r.patient_name,
                    blood: r.blood_group,
                    hospital: r.hospital,
                    date: r.timestamp.toLocaleDateString('en-GB'),
                    requester_name: requester.full_name,
                    requester_phone: requester.phone,
                    donor_name: donor ? donor.full_name : "N/A",
                    donor_phone: donor ? donor.phone : "N/A"
                });
            }
        }
        res.json(output);
    } catch (error) { res.status(500).json({ message: "Error" }); }
});

// Force Inventory Init (Admin)
app.get('/api/admin/force-inventory', async (req, res) => {
    try {
        const groups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
        
        let count = 0;
        for (const g of groups) {
            const exists = await BloodInventory.findOne({ blood_group: g });
            if (!exists) {
                await BloodInventory.create({
                    blood_group: g,
                    units: 0,
                    last_updated: new Date()
                });
                count++;
            }
        }
        
        res.json({
            status: "success",
            message: `Inventory Fixed! Added ${count} groups.`,
            total_groups: groups.length
        });
    } catch (error) {
        console.error('Force Inventory Error:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// ==================== DATABASE INITIALIZATION ====================
async function initDatabase() {
    try {
        console.log("🔧 Initializing MongoDB Database with all fields...");
        
        // Just initialize inventory - indexes are auto-created by Mongoose
        await initInventory();
        
        // Create text indexes for search (optional - these don't conflict)
        try {
            await Donor.collection.createIndex({ full_name: "text", email: "text" });
            console.log("✅ Text indexes created for donors");
        } catch (e) {
            console.log("⚠️ Text indexes may already exist");
        }
        
        console.log("✅ Database initialized successfully!");
        console.log("📊 Collections ready:");
        console.log(`   • donors: ${await Donor.countDocuments()} documents`);
        console.log(`   • requesters: ${await Requester.countDocuments()} documents`);
        console.log(`   • blood_requests: ${await BloodRequest.countDocuments()} documents`);
        console.log(`   • blood_inventory: ${await BloodInventory.countDocuments()} documents`);
        
    } catch (error) {
        console.error('Database Initialization Error:', error);
        console.log('⚠️ Continuing despite initialization error...');
    }
}

app.put('/api/profile/update/:role/:u_id', async (req, res) => {
    try {
        const { role, u_id } = req.params;
        const { full_name, phone, lat, lng } = req.body;
        
        // ✅ Node.js-la namma models-ah direct-ah use pannanum
        const Model = role === 'donor' ? Donor : Requester;
        
        const result = await Model.updateOne(
            { unique_id: u_id },
            { $set: { full_name, phone, lat, lng } }
        );

        if (result.matchedCount > 0) {
            const updatedUser = await Model.findOne({ unique_id: u_id });
            res.json({ 
                success: true, 
                user: {
                    name: updatedUser.full_name,
                    email: updatedUser.email,
                    role: role,
                    unique_id: updatedUser.unique_id,
                    bloodGroup: updatedUser.blood_group || ""
                }
            });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
// ==================== START SERVER ====================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 LifeDrop Node.js Backend running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
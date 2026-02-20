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

// ==================== FIREBASE ADMIN INITIALIZATION ====================
const admin = require('firebase-admin');

// Initialize Firebase Admin using Environment Variable
const firebaseConfig = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig)
});

const app = express();

// ==================== CONFIGURATION ====================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = "lifedrop108@gmail.com";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
const SECRET_KEY = process.env.SECRET_KEY || 'lifedrop-super-secret-key-2024';

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(cors({
    origin: [
    "http://localhost:5173",
    "https://life-drop-ai.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(helmet({
    contentSecurityPolicy: false
}));

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
    process.exit(1);
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
    fcm_token: { type: String, default: null }, // Token store panna
    created_at: { type: Date, default: Date.now }
});

const requesterSchema = new mongoose.Schema({
    unique_id: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
    timestamp: { type: Date, default: Date.now, expires: 600 } // Auto-delete after 10 minutes
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

// ==================== PUSH NOTIFICATION HELPER FUNCTION ====================
const sendPushNotification = async (token, patientName, bloodGroup, hospital) => {
    const message = {
        token: token,
        // ✅ MUKKIYAM: Ellathaiyum 'data' kulla anupuroam
        data: {
            title: '🚨 URGENT BLOOD REQUEST',
            body: `Hero! ${patientName} needs ${bloodGroup} blood at ${hospital}.`,
            patient: patientName,
            blood: bloodGroup,
            hospital: hospital,
            click_action: 'https://lifedrop-ai.vercel.app/donor-dashboard'
        },
        android: {
            priority: 'high',
            // Inga 'notification' block thevai illai
        },
        webpush: {
            headers: {
                Urgency: "high"
            }
            // Inga 'notification' block-ah thookitom, so double notification varaathu
        }
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('✅ Push Notification Sent Successfully:', response);
    } catch (error) {
        console.error('❌ Push Notification Error:', error);
    }
};
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

// Add Blockchain Block
async function addBlockchainBlock(requestId, event, dataDict) {
    const lastBlock = await BlockchainLedger.findOne().sort({ index: -1 });
    
    const prevHash = lastBlock ? lastBlock.current_hash : "0";
    
    const timestamp = new Date();
    const dataJson = JSON.stringify(dataDict);
    
    const newIndex = lastBlock ? lastBlock.index + 1 : 1;
    const newHash = calculateHash(newIndex, prevHash, timestamp.toISOString(), dataJson);
    
    await BlockchainLedger.create({
        index: newIndex,
        request_id: requestId.toString(),
        event: event,
        data: dataJson,
        previous_hash: prevHash,
        current_hash: newHash,
        timestamp: timestamp
    });
}

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
            fcm_token: null,
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

// ==================== NEW: SAVE FCM TOKEN API ====================
// API to Save FCM Token (Donor login/dashboard appo call aagum)
app.post('/api/save-fcm-token', async (req, res) => {
    try {
        const { unique_id, fcm_token } = req.body;
        // MongoDB-la donor profile-la token-ah save panroam
        await Donor.updateOne({ unique_id }, { $set: { fcm_token: fcm_token } });
        res.json({ success: true, message: "Token updated" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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
        
        // Send email with await to ensure it completes
        // But don't block response - use Promise
        sendBrevoOTP(email, otpCode).then(sent => {
            if (sent) {
                console.log(`✅ Email sent successfully to ${email}`);
            } else {
                console.log(`⚠️ Email sending had issues, but OTP saved in DB for ${email}`);
            }
        }).catch(err => {
            console.error(`❌ Email promise error: ${err.message}`);
        });
        
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
        const ipAddr = req.ip || req.connection.remoteAddress;
        
        // Check if blocked
        const { allowed, message } = await checkLoginBlock(ipAddr);
        if (!allowed) {
            return res.status(429).json({ success: false, message });
        }
        
        const { email, password, role } = req.body;
        
        // Admin Check
        if (email === "lifedrop108@gmail.com" && password === "lifedrop123") {
            return res.json({
                message: "Admin Login Success",
                user: {
                    name: "Super Admin",
                    role: "admin",
                    unique_id: "ADMIN"
                }
            });
        }
        
        // User Check
        let user = null;
        if (role === 'donor') {
            user = await Donor.findOne({ email });
        } else {
            user = await Requester.findOne({ email });
        }
        
        if (user && await bcrypt.compare(password, user.password)) {
            // Login Success - Clear attempts
            await LoginAttempt.deleteOne({ ip: ipAddr });
            
            const responseData = {
                message: "Login Success",
                user: {
                    name: user.full_name,
                    email: user.email,
                    role: role,
                    unique_id: user.unique_id
                }
            };
            
            if (role === 'donor') {
                responseData.user.bloodGroup = user.blood_group;
                // Also return fcm_token if needed
                responseData.user.fcm_token = user.fcm_token;
            }
            
            res.json(responseData);
        } else {
            // Login Failed - Log attempt
            await logFailedAttempt(ipAddr);
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

// Get Requester History
app.get('/api/requester/history/:u_id', async (req, res) => {
    try {
        const requests = await BloodRequest.find({ requester_id: req.params.u_id })
            .sort({ timestamp: -1 });
        
        const output = [];
        
        for (const r of requests) {
            let donorInfo = null;
            
            // Check if any donor accepted this request
            const acceptedNotif = await Notification.findOne({
                request_id: r._id,
                status: { $in: ['Accepted', 'Donated', 'Completed'] }
            });
            
            if (acceptedNotif) {
                const donor = await Donor.findOne({ unique_id: acceptedNotif.donor_id });
                if (donor) {
                    donorInfo = {
                        name: donor.full_name,
                        phone: donor.phone,
                        status: acceptedNotif.status
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
                accepted_donor: donorInfo
            });
        }
        
        res.json(output);
    } catch (error) {
        console.error('Requester History Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Create Blood Request
app.post('/api/request/create', async (req, res) => {
    try {
        const data = req.body;
        
        const newReq = await BloodRequest.create({
            requester_id: data.requester_id,
            patient_name: data.patientName,
            contact_number: data.contactNumber,
            blood_group: data.bloodGroup,
            units: data.units,
            urgency: data.urgency,
            hospital: data.hospital,
            lat: data.lat,
            lng: data.lng,
            status: 'Pending',
            timestamp: new Date()
        });
        
        const requestId = newReq._id.toString();
        
        await addBlockchainBlock(requestId, "Request Initialized", {
            patient: data.patientName,
            group: data.bloodGroup,
            hospital: data.hospital
        });
        
        res.status(201).json({
            message: "Request Created Successfully",
            id: requestId
        });
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
        
        const allowedDonorGroups = BLOOD_COMPATIBILITY[bloodReq.blood_group] || [bloodReq.blood_group];
        const cooldownLimit = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        
        // Build query
        const query = {
            blood_group: { $in: allowedDonorGroups },
            is_available: true,
            $or: [
                { last_donation_date: null },
                { last_donation_date: { $lte: cooldownLimit } }
            ]
        };
        
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
                isExact: isExact,
                fcm_token: d.fcm_token // Include token for push notifications
            });
        }
        
        matches.sort((a, b) => b.match - a.match);
        
        res.json({
            request: {
                lat: bloodReq.lat,
                lng: bloodReq.lng,
                blood: bloodReq.blood_group
            },
            matches: matches
        });
    } catch (error) {
        console.error('Match Donors Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ==================== UPDATED: Send Notification to Donor with Push Notification ====================
app.post('/api/send-request', async (req, res) => {
    try {
        const data = req.body;
        
        const exists = await Notification.findOne({
            donor_id: data.donor_id,
            request_id: new ObjectId(data.request_id)
        });
        
        if (!exists) {
            const newNotif = await Notification.create({
                donor_id: data.donor_id,
                request_id: new ObjectId(data.request_id),
                status: "Pending",
                blood_bag_id: null,
                created_at: new Date()
            });
            
            const donor = await Donor.findOne({ unique_id: data.donor_id });
            const bloodReq = await BloodRequest.findById(data.request_id);
            const requester = await Requester.findOne({ unique_id: bloodReq.requester_id });
            
            const reqDetails = {
                patient: bloodReq.patient_name,
                blood: bloodReq.blood_group,
                hospital: bloodReq.hospital,
                requester: requester ? requester.full_name : "N/A",
                phone: bloodReq.contact_number
            };
            
            // Send email asynchronously
            sendRequestAlertEmail(donor.email, donor.full_name, reqDetails);
            
            // --- ADD PUSH NOTIFICATION TRIGGER ---
            if (donor && donor.fcm_token && bloodReq) {
                // Trigger the push notification
                sendPushNotification(
                    donor.fcm_token, 
                    bloodReq.patient_name, 
                    bloodReq.blood_group, 
                    bloodReq.hospital
                );
            }
            
            res.status(201).json({ message: "Request sent successfully via Email & Push!" });
        } else {
            res.json({ message: "Request already sent to this donor" });
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
            fcm_token: donor.fcm_token // Include FCM token
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
            });
            
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
app.post('/api/notif/donate', async (req, res) => {
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
                { $set: {
                    status: 'Donated',
                    blood_bag_id: data.bag_id
                }}
            );
            
            const donor = await Donor.findOne({ unique_id: notif.donor_id });
            if (donor) {
                await Donor.updateOne(
                    { unique_id: notif.donor_id },
                    { 
                        $set: {
                            last_donation_date: new Date(),
                            cooldown_email_sent: false
                        },
                        $inc: { donation_count: 1 }
                    }
                );
            }
            
            await BloodRequest.updateOne(
                { _id: notif.request_id },
                { $set: { status: 'On the way' } }
            );
            
            await addBlockchainBlock(notif.request_id.toString(), "Blood Bag Dispatched", {
                bag_id: data.bag_id,
                donor: donor ? donor.full_name : "Unknown"
            });
            
            res.json({ message: "Donation Success!" });
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        console.error('Donation Submit Error:', error);
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
            });
            
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
        
        await Broadcast.create({
            message: data.message,
            timestamp: new Date()
        });
        
        res.status(201).json({ message: "Broadcast sent successfully!" });
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
        
        await BloodCamp.create({
            title: data.title,
            location: data.location,
            city: data.city,
            date: data.date,
            time: data.time,
            organizer: "LifeDrop Official",
            created_at: new Date()
        });
        
        // Create broadcast message
        const broadcastMsg = `New Donation Camp: ${data.title} at ${data.city} on ${data.date}`;
        await Broadcast.create({
            message: broadcastMsg,
            timestamp: new Date()
        });
        
        res.status(201).json({ message: "Donation Camp Scheduled Successfully!" });
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

// Chat with AI
app.post('/api/chat', async (req, res) => {
    try {
        const userMsg = req.body.message || "";
        
        // Fetch Inventory Context
        const inventory = await BloodInventory.find();
        const stockInfo = inventory.map(i => `${i.blood_group}: ${i.units} units`).join(", ");
        
        // Advanced System Instructions
        const promptContext = `
    System: You are 'LifeDrop AI Assistant'.
    Inventory Data: ${stockInfo}.
    
    Strict Rules:
    - Only answer health, blood donation, or LifeDrop app related queries.
    - If user asks about blood stock, use the provided Inventory Data.
    - For non-medical/off-topic questions, say: 'I am a specialized Blood Donation Assistant. I only handle health-related queries.'
    - Support Tamil and English. Answer in the user's language.
    - Guidance for donation: Tell them to go to 'Become a Donor'.
    - Guidance for requesting: Tell them to use 'New Request'.
    `;
        
        // Payload for Gemini API
        const payload = {
            contents: [{
                parts: [{ text: `${promptContext}\n\nUser Question: ${userMsg}` }]
            }]
        };
        
        const response = await axios.post(GEMINI_URL, payload);
        const resData = response.data;
        
        const botReply = resData.candidates[0].content.parts[0].text;
        res.json({ reply: botReply });
        
    } catch (error) {
        console.log(`AI Error: ${error.message}`);
        res.status(500).json({ reply: "Sorry nanba, I'm having trouble connecting to AI. Please try again." });
    }
});

// View Blockchain for Request
app.get('/api/blockchain/view/:req_id', async (req, res) => {
    try {
        const blocks = await BlockchainLedger.find({ request_id: req.params.req_id });
        
        const output = [];
        
        for (const b of blocks) {
            let dataJson;
            try {
                dataJson = JSON.parse(b.data);
            } catch {
                dataJson = b.data;
            }
            
            output.push({
                event: b.event,
                data: dataJson,
                prev_hash: b.previous_hash.substring(0, 16) + "...",
                curr_hash: b.current_hash.substring(0, 16) + "...",
                time: b.timestamp.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            });
        }
        
        res.json(output);
    } catch (error) {
        console.error('Blockchain View Error:', error);
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

// ==================== START SERVER ====================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 LifeDrop Node.js Backend running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
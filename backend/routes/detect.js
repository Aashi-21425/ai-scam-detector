const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ScanResult = require('../models/ScanResult');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function callGeminiAI(type, content, language) {
  const typeLabel = {
    text: 'SMS/Text Message',
    email: 'Email',
    url: 'URL or Website',
    phone: 'Phone Call Description',
  }[type];

  const prompt = `You are an expert scam detection AI. Analyze the following ${typeLabel}.

CONTENT:
"""
${content}
"""

Respond EXACTLY in this format and in ${language} language:
RISK_LEVEL: HIGH or MEDIUM or LOW
SCAM_SCORE: (0-100)
SCAM_CATEGORY: (Phishing/Lottery/KYC Fraud/Bank Fraud/Job Fraud/Other)
SUMMARY: (one sentence verdict)
RED_FLAGS:
- flag1
SAFE_SIGNS:
- sign1
RECOMMENDATION:
(2-3 sentences advice)`;

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

function parseResponse(text) {
  const riskLevel = (text.match(/RISK_LEVEL:\s*(HIGH|MEDIUM|LOW)/i) || [])[1]?.toUpperCase() || 'LOW';
  const scamScore = parseInt((text.match(/SCAM_SCORE:\s*(\d+)/i) || [])[1]) || 0;
  const scamCategory = (text.match(/SCAM_CATEGORY:\s*([^\n]+)/i) || [])[1]?.trim() || 'Other';
  const summary = (text.match(/SUMMARY:\s*([^\n]+)/i) || [])[1]?.trim() || '';
  const recommendation = (text.match(/RECOMMENDATION:\s*([\s\S]*?)$/i) || [])[1]?.trim() || '';

  const redFlagsRaw = text.match(/RED_FLAGS:\s*([\s\S]*?)(?=SAFE_SIGNS|RECOMMENDATION|$)/i)?.[1] || '';
  const redFlags = redFlagsRaw.split('\n').map(s => s.replace(/^[-•*]\s*/, '').trim()).filter(s => s.length > 3);

  const safeRaw = text.match(/SAFE_SIGNS:\s*([\s\S]*?)(?=RECOMMENDATION|RED_FLAGS|$)/i)?.[1] || '';
  const safeSigns = safeRaw.split('\n').map(s => s.replace(/^[-•*]\s*/, '').trim()).filter(s => s.length > 3);

  return { riskLevel, scamScore, scamCategory, summary, redFlags, safeSigns, recommendation };
}

// ---------- Multi-language rule-based fallback ----------
const scamPatterns = {
  Lottery: ['congratulations', 'you have won', 'lucky draw', 'lottery', 'prize money', 'jackpot'],
  Urgency: ['urgent', 'act now', 'limited time', 'expires today', 'immediately'],
  BankFraud: ['processing fee', 'refundable fee', 'pay to claim', 'bank details', 'otp', 'account blocked'],
  Phishing: ['click here', 'verify your account', 'suspended', 'confirm your identity', 'update your kyc'],
  JobFraud: ['work from home', 'earn daily', 'no investment', 'guaranteed income'],
};

const fallbackText = {
  English: {
    scamSummary: 'This message contains common scam patterns and should be treated with caution.',
    safeSummary: 'No strong scam indicators detected in this message.',
    scamRecommendation: 'Do not click any links or share personal/financial information. Verify directly with the official source before taking any action.',
    safeRecommendation: 'Message appears low-risk, but always stay cautious with unexpected messages.',
    noRedFlags: 'No specific red flags detected',
    noSafeSigns: 'No suspicious keywords found',
    flagPrefix: 'Contains suspicious phrase',
  },
  Hindi: {
    scamSummary: 'इस मैसेज में सामान्य स्कैम पैटर्न पाए गए हैं, सावधान रहें।',
    safeSummary: 'इस मैसेज में कोई मजबूत स्कैम संकेत नहीं मिला।',
    scamRecommendation: 'किसी भी लिंक पर क्लिक न करें या व्यक्तिगत/बैंकिंग जानकारी साझा न करें। कोई भी कार्रवाई करने से पहले आधिकारिक स्रोत से पुष्टि करें।',
    safeRecommendation: 'मैसेज कम जोखिम वाला लगता है, फिर भी अनजान मैसेज से सतर्क रहें।',
    noRedFlags: 'कोई विशेष चेतावनी संकेत नहीं मिला',
    noSafeSigns: 'कोई संदिग्ध शब्द नहीं मिला',
    flagPrefix: 'संदिग्ध वाक्यांश मिला',
  },
  Tamil: {
    scamSummary: 'இந்த செய்தியில் பொதுவான மோசடி முறைகள் உள்ளன, எச்சரிக்கையாக இருங்கள்.',
    safeSummary: 'இந்த செய்தியில் வலுவான மோசடி அறிகுறிகள் இல்லை.',
    scamRecommendation: 'எந்த இணைப்பையும் கிளிக் செய்ய வேண்டாம் அல்லது தனிப்பட்ட/வங்கி தகவல்களை பகிர வேண்டாம். எந்த நடவடிக்கையும் எடுப்பதற்கு முன் அதிகாரப்பூர்வ மூலத்துடன் உறுதிப்படுத்தவும்.',
    safeRecommendation: 'செய்தி குறைந்த ஆபத்து உள்ளதாக தோன்றுகிறது, ஆனாலும் எச்சரிக்கையாக இருங்கள்.',
    noRedFlags: 'குறிப்பிட்ட எச்சரிக்கை அறிகுறிகள் இல்லை',
    noSafeSigns: 'சந்தேகத்திற்குரிய வார்த்தைகள் இல்லை',
    flagPrefix: 'சந்தேகத்திற்குரிய சொற்றொடர் உள்ளது',
  },
  Telugu: {
    scamSummary: 'ఈ సందేశంలో సాధారణ మోసం నమూనాలు ఉన్నాయి, జాగ్రత్తగా ఉండండి.',
    safeSummary: 'ఈ సందేశంలో బలమైన మోసం సూచనలు కనుగొనబడలేదు.',
    scamRecommendation: 'ఏ లింక్‌లనూ క్లిక్ చేయవద్దు లేదా వ్యక్తిగత/బ్యాంకు వివరాలను పంచుకోవద్దు. ఏదైనా చర్య తీసుకునే ముందు అధికారిక మూలంతో నిర్ధారించుకోండి.',
    safeRecommendation: 'సందేశం తక్కువ ప్రమాదకరంగా కనిపిస్తుంది, అయినప్పటికీ జాగ్రత్తగా ఉండండి.',
    noRedFlags: 'నిర్దిష్ట హెచ్చరిక సంకేతాలు కనుగొనబడలేదు',
    noSafeSigns: 'అనుమానాస్పద పదాలు కనుగొనబడలేదు',
    flagPrefix: 'అనుమానాస్పద పదబంధం ఉంది',
  },
  Bengali: {
    scamSummary: 'এই বার্তায় সাধারণ প্রতারণার ধরণ রয়েছে, সতর্ক থাকুন।',
    safeSummary: 'এই বার্তায় কোনো শক্তিশালী প্রতারণার লক্ষণ পাওয়া যায়নি।',
    scamRecommendation: 'কোনো লিঙ্কে ক্লিক করবেন না বা ব্যক্তিগত/ব্যাংক তথ্য শেয়ার করবেন না। কোনো পদক্ষেপ নেওয়ার আগে অফিসিয়াল উৎসের সাথে যাচাই করুন।',
    safeRecommendation: 'বার্তাটি কম ঝুঁকিপূর্ণ মনে হচ্ছে, তবুও অপ্রত্যাশিত বার্তা থেকে সতর্ক থাকুন।',
    noRedFlags: 'নির্দিষ্ট কোনো সতর্কতা চিহ্ন পাওয়া যায়নি',
    noSafeSigns: 'কোনো সন্দেহজনক শব্দ পাওয়া যায়নি',
    flagPrefix: 'সন্দেহজনক বাক্যাংশ রয়েছে',
  },
  Marathi: {
    scamSummary: 'या संदेशात सामान्य फसवणुकीचे नमुने आढळले आहेत, सावध रहा.',
    safeSummary: 'या संदेशात कोणतेही ठोस फसवणुकीचे संकेत आढळले नाहीत.',
    scamRecommendation: 'कोणत्याही लिंकवर क्लिक करू नका किंवा वैयक्तिक/बँक माहिती शेअर करू नका. कोणतीही कृती करण्यापूर्वी अधिकृत स्त्रोताकडून खात्री करा.',
    safeRecommendation: 'संदेश कमी धोकादायक वाटतो, तरीही अनपेक्षित संदेशांपासून सावध रहा.',
    noRedFlags: 'कोणतेही विशिष्ट धोक्याचे संकेत आढळले नाहीत',
    noSafeSigns: 'कोणतेही संशयास्पद शब्द आढळले नाहीत',
    flagPrefix: 'संशयास्पद वाक्यांश आढळला',
  },
};

function ruleBasedDetection(content, language = 'English') {
  const texts = fallbackText[language] || fallbackText.English;
  const lowerText = content.toLowerCase();
  let score = 0;
  let matchedCategory = 'Other';
  let redFlags = [];

  for (const [category, keywords] of Object.entries(scamPatterns)) {
    const matches = keywords.filter(word => lowerText.includes(word));
    if (matches.length > 0) {
      score += matches.length * 15;
      matchedCategory = category;
      redFlags.push(...matches.map(m => `${texts.flagPrefix}: "${m}"`));
    }
  }

  score = Math.min(score, 100);
  const riskLevel = score >= 60 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW';

  return {
    riskLevel,
    scamScore: score,
    scamCategory: matchedCategory,
    summary: score >= 30 ? texts.scamSummary : texts.safeSummary,
    redFlags: redFlags.length ? redFlags : [texts.noRedFlags],
    safeSigns: score < 30 ? [texts.noSafeSigns] : [],
    recommendation: score >= 30 ? texts.scamRecommendation : texts.safeRecommendation,
  };
}
// ------------------------------------------------

router.post('/', async (req, res) => {
  try {
    const { type, content, language = 'English', userId } = req.body;

    if (!type || !content) {
      return res.status(400).json({ error: 'type and content are required' });
    }

    let parsed;
    try {
      const aiText = await callGeminiAI(type, content, language);
      parsed = parseResponse(aiText);
    } catch (aiError) {
      console.log('AI unavailable, using fallback detection:', aiError.message);
      parsed = ruleBasedDetection(content, language);
    }

    const scan = await ScanResult.create({
      userId: userId || null,
      type,
      inputContent: content,
      language,
      riskLevel: parsed.riskLevel,
      scamScore: parsed.scamScore,
      scamCategory: parsed.scamCategory,
      summary: parsed.summary,
      redFlags: parsed.redFlags,
      safeSigns: parsed.safeSigns,
      recommendation: parsed.recommendation,
    });

    res.json({
      success: true,
      scanId: scan._id,
      result: parsed,
    });

  } catch (err) {
    console.error('Detection error:', err.message);
    res.status(500).json({ error: 'Detection failed: ' + err.message });
  }
});

module.exports = router;
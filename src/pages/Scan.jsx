// Scan.jsx
// Main scan page with AI detection
// Features: 4 tabs, multilingual, voice output, risk percentage
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { detectScam } from '../utils/api';

const TABS = [
  { id: 'text',  label: '💬 SMS / Text',   placeholder: 'Paste suspicious SMS or text message...' },
  { id: 'email', label: '📧 Email',         placeholder: 'Paste suspicious email content...' },
  { id: 'url',   label: '🌐 URL / Website', placeholder: 'Paste suspicious URL or website content...' },
  { id: 'phone', label: '📞 Phone Call',    placeholder: 'Describe what the caller said...' },
];

const LANGUAGES = [
  { code: 'English', label: '🇬🇧 English',    voice: 'en-IN' },
  { code: 'Hindi',   label: '🇮🇳 Hindi',      voice: 'hi-IN' },
  { code: 'Tamil',   label: '🌴 Tamil',       voice: 'ta-IN' },
  { code: 'Telugu',  label: '🌺 Telugu',      voice: 'te-IN' },
  { code: 'Bengali', label: '🌸 Bengali',     voice: 'bn-IN' },
  { code: 'Marathi', label: '🎭 Marathi',     voice: 'mr-IN' },
];

const RISK = {
  HIGH:   { color: '#ff4444', bg: '#2a0a0a' },
  MEDIUM: { color: '#ff9900', bg: '#2a1a00' },
  LOW:    { color: '#00cc55', bg: '#0a2a14' },
};

const UI_TEXT = {
  English: {
    heading: '🔍 Scan for Scams', selectLang: '🌍 Select Language for AI Response',
    detectBtn: '🔍 Detect Scam', analyzing: '⏳ Analyzing...', characters: 'characters',
    riskPercentage: 'Risk Percentage', chanceText: '% chance this is a scam',
    redFlags: '🚩 Red Flags', safeSigns: '✅ Safe Signs', whatToDo: '💡 What To Do',
    noneDetected: 'None detected', noneFound: 'None found', listenIn: 'Listen in',
    stopVoice: '⏹️ Stop Voice',
    highRisk: '🚨 Very likely a scam. Do not click or respond!',
    mediumRisk: '⚠️ Be careful before trusting this', lowRisk: '✅ This looks safe',
    highLabel: '🚨 HIGH RISK — SCAM DETECTED!', mediumLabel: '⚠️ MEDIUM RISK — Be Careful', lowLabel: '✅ LOW RISK — Looks Safe',
  },
  Hindi: {
    heading: '🔍 स्कैम स्कैन करें', selectLang: '🌍 भाषा चुनें',
    detectBtn: '🔍 स्कैम जांचें', analyzing: '⏳ विश्लेषण हो रहा है...', characters: 'अक्षर',
    riskPercentage: 'जोखिम प्रतिशत', chanceText: '% स्कैम होने की संभावना',
    redFlags: '🚩 चेतावनी संकेत', safeSigns: '✅ सुरक्षित संकेत', whatToDo: '💡 क्या करें',
    noneDetected: 'कुछ नहीं मिला', noneFound: 'कुछ नहीं मिला', listenIn: 'सुनें',
    stopVoice: '⏹️ रोकें',
    highRisk: '🚨 यह स्कैम होने की संभावना अधिक है। क्लिक न करें!',
    mediumRisk: '⚠️ भरोसा करने से पहले सावधान रहें', lowRisk: '✅ यह सुरक्षित लगता है',
    highLabel: '🚨 उच्च जोखिम — स्कैम पाया गया!', mediumLabel: '⚠️ मध्यम जोखिम — सावधान रहें', lowLabel: '✅ कम जोखिम — सुरक्षित लगता है',
  },
  Tamil: {
    heading: '🔍 மோசடிகளை ஸ்கேன் செய்யவும்', selectLang: '🌍 மொழியைத் தேர்ந்தெடுக்கவும்',
    detectBtn: '🔍 மோசடி கண்டறி', analyzing: '⏳ பகுப்பாய்வு நடக்கிறது...', characters: 'எழுத்துகள்',
    riskPercentage: 'ஆபத்து சதவீதம்', chanceText: '% மோசடி வாய்ப்பு',
    redFlags: '🚩 எச்சரிக்கை அறிகுறிகள்', safeSigns: '✅ பாதுகாப்பான அறிகுறிகள்', whatToDo: '💡 என்ன செய்ய வேண்டும்',
    noneDetected: 'எதுவும் இல்லை', noneFound: 'எதுவும் இல்லை', listenIn: 'கேளுங்கள்',
    stopVoice: '⏹️ நிறுத்து',
    highRisk: '🚨 இது மோசடியாக இருக்க வாய்ப்புள்ளது!', mediumRisk: '⚠️ நம்புவதற்கு முன் எச்சரிக்கையாக இருங்கள்',
    lowRisk: '✅ இது பாதுகாப்பானதாக தோன்றுகிறது',
    highLabel: '🚨 அதிக ஆபத்து — மோசடி கண்டறியப்பட்டது!', mediumLabel: '⚠️ நடுத்தர ஆபத்து — எச்சரிக்கை', lowLabel: '✅ குறைந்த ஆபத்து — பாதுகாப்பானது',
  },
  Telugu: {
    heading: '🔍 మోసాల కోసం స్కాన్ చేయండి', selectLang: '🌍 భాషను ఎంచుకోండి',
    detectBtn: '🔍 మోసం గుర్తించండి', analyzing: '⏳ విశ్లేషణ జరుగుతోంది...', characters: 'అక్షరాలు',
    riskPercentage: 'ప్రమాద శాతం', chanceText: '% మోసం అవకాశం',
    redFlags: '🚩 హెచ్చరిక సంకేతాలు', safeSigns: '✅ సురక్షిత సంకేతాలు', whatToDo: '💡 ఏమి చేయాలి',
    noneDetected: 'ఏమీ కనుగొనబడలేదు', noneFound: 'ఏమీ కనుగొనబడలేదు', listenIn: 'వినండి',
    stopVoice: '⏹️ ఆపు',
    highRisk: '🚨 ఇది మోసం అయ్యే అవకాశం ఉంది!', mediumRisk: '⚠️ నమ్మే ముందు జాగ్రత్తగా ఉండండి',
    lowRisk: '✅ ఇది సురక్షితంగా కనిపిస్తుంది',
    highLabel: '🚨 అధిక ప్రమాదం — మోసం గుర్తించబడింది!', mediumLabel: '⚠️ మధ్యస్థ ప్రమాదం — జాగ్రత్త', lowLabel: '✅ తక్కువ ప్రమాదం — సురక్షితం',
  },
  Bengali: {
    heading: '🔍 স্ক্যাম স্ক্যান করুন', selectLang: '🌍 ভাষা নির্বাচন করুন',
    detectBtn: '🔍 স্ক্যাম শনাক্ত করুন', analyzing: '⏳ বিশ্লেষণ চলছে...', characters: 'অক্ষর',
    riskPercentage: 'ঝুঁকির শতাংশ', chanceText: '% স্ক্যাম হওয়ার সম্ভাবনা',
    redFlags: '🚩 সতর্কতা চিহ্ন', safeSigns: '✅ নিরাপদ চিহ্ন', whatToDo: '💡 কী করবেন',
    noneDetected: 'কিছু পাওয়া যায়নি', noneFound: 'কিছু পাওয়া যায়নি', listenIn: 'শুনুন',
    stopVoice: '⏹️ থামান',
    highRisk: '🚨 এটি স্ক্যাম হওয়ার সম্ভাবনা বেশি!', mediumRisk: '⚠️ বিশ্বাস করার আগে সতর্ক থাকুন',
    lowRisk: '✅ এটি নিরাপদ মনে হচ্ছে',
    highLabel: '🚨 উচ্চ ঝুঁকি — স্ক্যাম শনাক্ত হয়েছে!', mediumLabel: '⚠️ মাঝারি ঝুঁকি — সতর্ক থাকুন', lowLabel: '✅ কম ঝুঁকি — নিরাপদ মনে হচ্ছে',
  },
  Marathi: {
    heading: '🔍 फसवणुकीसाठी स्कॅन करा', selectLang: '🌍 भाषा निवडा',
    detectBtn: '🔍 फसवणूक शोधा', analyzing: '⏳ विश्लेषण चालू आहे...', characters: 'अक्षरे',
    riskPercentage: 'धोका टक्केवारी', chanceText: '% फसवणूक होण्याची शक्यता',
    redFlags: '🚩 धोक्याचे संकेत', safeSigns: '✅ सुरक्षित संकेत', whatToDo: '💡 काय करावे',
    noneDetected: 'काहीही आढळले नाही', noneFound: 'काहीही आढळले नाही', listenIn: 'ऐका',
    stopVoice: '⏹️ थांबवा',
    highRisk: '🚨 ही फसवणूक असण्याची शक्यता जास्त आहे!', mediumRisk: '⚠️ विश्वास ठेवण्यापूर्वी सावध रहा',
    lowRisk: '✅ हे सुरक्षित दिसते',
    highLabel: '🚨 उच्च धोका — फसवणूक आढळली!', mediumLabel: '⚠️ मध्यम धोका — सावध रहा', lowLabel: '✅ कमी धोका — सुरक्षित दिसते',
  },
};

export default function Scan() {
  const { user } = useAuth();
  const [tab, setTab]           = useState('text');
  const [input, setInput]       = useState('');
  const [language, setLanguage] = useState('English');
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [speaking, setSpeaking] = useState(false);

  const currentTab = TABS.find(t => t.id === tab);
  const currentLang = LANGUAGES.find(l => l.code === language);
  const t = UI_TEXT[language] || UI_TEXT.English;

  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  async function handleDetect() {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await detectScam(tab, input, language, user?.id);
      setResult(res.data.result);
    } catch (err) {
      console.log(err);
      console.log(err.response);
      console.log(err.response?.data);
      setError(err.response?.data?.error || err.message);
    }
    setLoading(false);
  }

  function speakResult(text) {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    const setupAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const langVoice = voices.find(v => v.lang.startsWith(currentLang.voice.split('-')[0]));
      if (langVoice) speech.voice = langVoice;
      speech.lang = currentLang.voice;
      speech.rate = 0.9;
      speech.onend = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(speech);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = setupAndSpeak;
    } else {
      setupAndSpeak();
    }
  }

  const riskColors = result ? RISK[result.riskLevel] : null;
  const riskLabel = result
    ? (result.riskLevel === 'HIGH' ? t.highLabel : result.riskLevel === 'MEDIUM' ? t.mediumLabel : t.lowLabel)
    : null;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}>
      <h2 style={{ color: '#a0c4ff', marginBottom: 24, fontSize: 24 }}>{t.heading}</h2>

      {/* ── Language Selector ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 12, color: '#6677aa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
          {t.selectLang}
        </label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
          {LANGUAGES.map(lang => (
            <button key={lang.code} onClick={() => setLanguage(lang.code)}
              style={{
                padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                background: language === lang.code ? '#3a6cf4' : '#1a1a3e',
                color: language === lang.code ? '#fff' : '#8899cc',
              }}>
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {TABS.map(tb => (
          <button key={tb.id} onClick={() => { setTab(tb.id); setResult(null); setInput(''); }}
            style={{
              padding: '9px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 13,
              background: tab === tb.id ? 'linear-gradient(135deg, #3a6cf4, #8b5cf6)' : '#141430',
              color: tab === tb.id ? '#fff' : '#8899cc',
              boxShadow: tab === tb.id ? '0 3px 12px rgba(58,108,244,0.4)' : 'none',
            }}>
            {tb.label}
          </button>
        ))}
      </div>

      {/* ── Input Area ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, color: '#6677aa', fontWeight: 700, textTransform: 'uppercase' }}>
          {currentTab.label}
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={currentTab.placeholder}
          rows={5}
          style={{
            width: '100%', marginTop: 10, background: '#080818', color: '#dde',
            border: '1px solid #1e1e4e', borderRadius: 8, padding: 12, fontSize: 14,
            resize: 'vertical', outline: 'none', fontFamily: 'inherit', lineHeight: 1.6,
            boxSizing: 'border-box',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <span style={{ fontSize: 11, color: '#445' }}>{input.length} {t.characters}</span>
          <button onClick={handleDetect} disabled={loading || !input.trim()}
            style={{
              padding: '11px 28px', borderRadius: 8, border: 'none',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              background: loading || !input.trim() ? '#1e1e4e' : 'linear-gradient(135deg, #3a6cf4, #8b5cf6)',
              color: '#fff', fontWeight: 700, fontSize: 15,
              boxShadow: loading || !input.trim() ? 'none' : '0 4px 16px rgba(58,108,244,0.4)',
            }}>
            {loading ? t.analyzing : t.detectBtn}
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ background: '#2a0a0a', border: '1px solid #ff4444', borderRadius: 10, padding: 16, marginBottom: 16, color: '#ff8888' }}>
          {error}
        </div>
      )}

      {/* ── Result ── */}
      {result && riskColors && (
        <div style={{ background: '#0f0f2a', borderRadius: 14, border: `2px solid ${riskColors.color}`, overflow: 'hidden', marginBottom: 20 }}>

          <div style={{ background: riskColors.color, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>{riskLabel}</span>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600 }}>
              {result.scamCategory}
            </span>
          </div>

          <div style={{ padding: 20 }}>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#8899cc' }}>{t.riskPercentage}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: riskColors.color }}>{result.scamScore}{t.chanceText}</span>
              </div>
              <div style={{ background: '#1a1a3e', borderRadius: 20, height: 12, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${result.scamScore}%`,
                  background: riskColors.color,
                  borderRadius: 20,
                  transition: 'width 1s ease',
                }} />
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 12, color: '#6677aa' }}>
                {result.scamScore >= 61 ? t.highRisk :
                 result.scamScore >= 31 ? t.mediumRisk :
                 t.lowRisk}
              </p>
            </div>

            {result.summary && (
              <div style={{ background: riskColors.bg, borderRadius: 8, padding: 14, marginBottom: 16, borderLeft: `4px solid ${riskColors.color}` }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{result.summary}</p>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div style={{ background: '#1a0808', borderRadius: 10, padding: 14, border: '1px solid #3a1a1a' }}>
                <h4 style={{ margin: '0 0 10px', color: '#ff6666', fontSize: 13 }}>{t.redFlags}</h4>
                {result.redFlags?.length > 0
                  ? result.redFlags.map((f, i) => <div key={i} style={{ fontSize: 12, color: '#ffaaaa', marginBottom: 5 }}>• {f}</div>)
                  : <div style={{ fontSize: 12, color: '#555' }}>{t.noneDetected}</div>}
              </div>
              <div style={{ background: '#081a0e', borderRadius: 10, padding: 14, border: '1px solid #1a3a20' }}>
                <h4 style={{ margin: '0 0 10px', color: '#44ff88', fontSize: 13 }}>{t.safeSigns}</h4>
                {result.safeSigns?.length > 0
                  ? result.safeSigns.map((s, i) => <div key={i} style={{ fontSize: 12, color: '#aaffcc', marginBottom: 5 }}>• {s}</div>)
                  : <div style={{ fontSize: 12, color: '#555' }}>{t.noneFound}</div>}
              </div>
            </div>

            {result.recommendation && (
              <div style={{ background: '#0a0a1e', borderRadius: 10, padding: 14, border: '1px solid #1e1e4e', marginBottom: 16 }}>
                <h4 style={{ margin: '0 0 8px', color: '#7aadff', fontSize: 13 }}>{t.whatToDo}</h4>
                <p style={{ margin: 0, fontSize: 13, color: '#bbc', lineHeight: 1.7 }}>{result.recommendation}</p>
              </div>
            )}

            <button
              onClick={() => speakResult(`${result.summary}. ${result.recommendation}`)}
              style={{
                padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: speaking ? '#ff4444' : 'linear-gradient(135deg, #00aa44, #00cc55)',
                color: '#fff', fontWeight: 700, fontSize: 14,
              }}>
              {speaking ? t.stopVoice : `🔊 ${t.listenIn} ${language}`}
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
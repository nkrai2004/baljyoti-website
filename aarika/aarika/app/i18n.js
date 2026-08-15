// AARIKA English/Hindi foundation
export const SUPPORTED_LOCALES = Object.freeze(["en-IN", "hi-IN"]);
const DICTIONARY = Object.freeze({
  en: { dashboard:"Dashboard", students:"Students", staff:"Staff", attendance:"Attendance", admissions:"Admissions", academics:"Academics", activities:"Activities", administration:"Administration", duties:"Duties", transport:"Transport", maintenance:"Cleaning & Maintenance", reports:"Reports & Audit" },
  hi: { dashboard:"डैशबोर्ड", students:"विद्यार्थी", staff:"स्टाफ", attendance:"उपस्थिति", admissions:"प्रवेश", academics:"शैक्षणिक", activities:"गतिविधियाँ", administration:"प्रशासन", duties:"ड्यूटी", transport:"परिवहन", maintenance:"सफाई एवं रखरखाव", reports:"रिपोर्ट एवं ऑडिट" }
});
export function t(key, locale="en-IN") { const lang=locale.startsWith("hi")?"hi":"en"; return DICTIONARY[lang][key] || key; }

// src/lib/rateLimit.js
// এটি একটি সাধারণ ইন-মেমোরি রেট লিমিটার।
// Vercel-এর সার্ভারলেস ফাংশনে প্রতিটি ইনস্ট্যান্স আলাদা হওয়ায় এটি পারফেক্ট নয়, তবে বেসিক বট আটকাতে দারুণ কাজ করে।

const rateLimitMap = new Map();

export function rateLimit(ip, limit = 5, windowMs = 60000) {
  const now = Date.now();
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const timestamps = rateLimitMap.get(ip).filter((time) => now - time < windowMs);
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);

  if (timestamps.length > limit) {
    return { success: false, message: "Too many requests. Please try again later." };
  }
  return { success: true };
}
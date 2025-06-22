const OpenAI = require('openai');

let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('✅ OpenAI configured');
} else {
  console.warn('⚠️ OpenAI API key not found, using fallback responses');
}

// Simple conversation tracker
let conversationStep = new Map();

const generateChatResponse = async (message, leadContext = {}, chatHistory = []) => {
  return getSmartFallbackResponse(message, chatHistory, leadContext);
};

const getSmartFallbackResponse = (message, chatHistory = [], leadContext = {}) => {
  // Use session-based step tracking
  const sessionId = leadContext?.sessionId || 'default';
  let currentStep = conversationStep.get(sessionId) || 0;
  
  console.log(`Session ${sessionId}, Step: ${currentStep}, Message: ${message}`);
  
  const questions = [
    "Welcome to GrowEasy Realtors! 🏠 Are you looking to buy or rent a property?",
    "Which city are you interested in? (e.g., Mumbai, Delhi, Pune)",
    "What type of property are you looking for? (e.g., 2BHK, 3BHK, Villa)",
    "What's your budget range? (e.g., 50L-80L, 1Cr-2Cr)",
    "What's your timeline for this? (e.g., 1 month, 3 months, urgent)",
    "Would you like to schedule a site visit?",
    "When would you like to visit? (e.g., Tomorrow, This weekend)",
    "What time works for you? (Morning/Afternoon/Evening)",
    "Please share your contact details (Name, Email, Phone)",
    "Thank you! Your details have been recorded. Our team will contact you soon."
  ];
  
  // Get current question
  const response = questions[currentStep] || questions[questions.length - 1];
  
  // Move to next step
  conversationStep.set(sessionId, currentStep + 1);
  
  return response;
};

// Function to classify lead based on responses
const classifyLead = (chatHistory) => {
  const userResponses = chatHistory
    .filter(msg => msg.sender === 'user')
    .map(msg => msg.message.toLowerCase());
  
  const allText = userResponses.join(' ');
  let score = 0;
  let reasons = [];
  
  // Check for buy/rent intent
  if (allText.includes('buy') || allText.includes('rent')) {
    score += 20;
    reasons.push('Clear intent specified');
  }
  
  // Check for location
  const cities = ['mumbai', 'delhi', 'pune', 'bangalore', 'hyderabad', 'chennai'];
  if (cities.some(city => allText.includes(city))) {
    score += 20;
    reasons.push('Location specified');
  }
  
  // Check for property type
  if (allText.includes('bhk') || allText.includes('villa') || allText.includes('flat')) {
    score += 15;
    reasons.push('Property type mentioned');
  }
  
  // Check for budget
  if (allText.match(/\d+\s*(l|lakh|cr|crore)/)) {
    score += 20;
    reasons.push('Budget range provided');
  }
  
  // Check for timeline
  if (allText.includes('urgent') || allText.includes('month') || allText.includes('immediate')) {
    score += 15;
    reasons.push('Timeline specified');
  }
  
  // Check for site visit interest
  if (allText.includes('yes') && allText.includes('visit')) {
    score += 10;
    reasons.push('Interested in site visit');
  }
  
  // Check for spam/invalid responses
  const invalidPatterns = /^[a-z]{10,}$|^\d{10,}$|test|spam/;
  const invalidCount = userResponses.filter(msg => invalidPatterns.test(msg)).length;
  if (invalidCount > userResponses.length * 0.3) {
    return { status: 'Invalid', confidence: 0.9, reason: 'Spam or invalid responses', score: 0 };
  }
  
  // Classify based on score
  if (score >= 70) {
    return { status: 'Hot', confidence: 0.9, reason: reasons.join(', '), score };
  } else if (score >= 40) {
    return { status: 'Cold', confidence: 0.7, reason: reasons.join(', '), score };
  } else {
    return { status: 'Invalid', confidence: 0.6, reason: 'Insufficient information', score };
  }
};

module.exports = { generateChatResponse, classifyLead };
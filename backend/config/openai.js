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



const generateChatResponse = async (message, leadContext = {}, chatHistory = []) => {
  return getSmartFallbackResponse(message, chatHistory);
};

const getSmartFallbackResponse = (message, chatHistory = []) => {
  // Count total messages to determine conversation step
  const totalMessages = chatHistory.length;
  const userMessage = message.toLowerCase();
  
  console.log('Step:', Math.floor(totalMessages / 2) + 1, 'Total messages:', totalMessages);
  
  // Step 1: Welcome (first message)
  if (totalMessages === 0) {
    return "Welcome to GrowEasy Realtors! 🏠 Are you looking to buy or rent a property?";
  }
  
  // Step 2: After buy/rent question
  if (totalMessages === 1) {
    if (userMessage.includes('buy')) {
      return "Which city are you looking to buy in?";
    } else if (userMessage.includes('rent')) {
      return "Which city are you looking to rent in?";
    }
    return "Please specify if you want to buy or rent a property.";
  }
  
  // Step 3: After city question
  if (totalMessages === 3) {
    return "What type of property are you looking for? (e.g., 2BHK, 3BHK, Villa)";
  }
  
  // Step 4: After property type question
  if (totalMessages === 5) {
    return "What's your budget range? (e.g., 50L-80L)";
  }
  
  // Step 5: After budget question
  if (totalMessages === 7) {
    return "What's your timeline for this? (e.g., 1 month, 3 months, urgent)";
  }
  
  // Step 6: After timeline question
  if (totalMessages === 9) {
    return "Would you like to schedule a site visit to see available properties?";
  }
  
  // Step 7: After site visit question
  if (totalMessages === 11) {
    if (userMessage.includes('yes') || userMessage.includes('sure')) {
      return "When would you like to visit? (e.g., Tomorrow, Monday, 15/12)";
    } else {
      return "Thank you for your interest! We'll contact you with suitable properties.";
    }
  }
  
  // Step 8: After visit date question
  if (totalMessages === 13) {
    return "What time works for you? Morning, Afternoon, or Evening?";
  }
  
  // Step 9: After time slot question
  if (totalMessages === 15) {
    return "Please share your name, email and contact number to confirm your visit.";
  }
  
  // Step 10: After contact details
  if (totalMessages === 17) {
    return "Thank you! Your site visit is confirmed. You'll receive details shortly. Our executive will contact you before the visit.";
  }
  
  // Default fallback
  return "Thank you for your interest! How else can I help you?";
};

module.exports = { generateChatResponse };
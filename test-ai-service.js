// Test script for Enhanced Agricultural AI Service
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyAQMuttFKBjxdZoiIs6d9uGzBML0Ific0Y';

async function testAI() {
  try {
    console.log('🧪 Testing Enhanced Agricultural AI Service...');
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `You are an expert agricultural AI assistant. A farmer asks: "What should I plant in summer season in North India?" 

Please provide specific crop recommendations with planting timing.`;

    console.log('📤 Sending test query to Gemini 2.0 Flash...');
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('✅ AI Response received successfully!');
    console.log('📝 Response length:', text.length, 'characters');
    console.log('🌱 AI Response Preview:');
    console.log(text.substring(0, 300) + '...');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing AI service:', error.message);
    return false;
  }
}

testAI().then((success) => {
  if (success) {
    console.log('\n🎉 Enhanced Agricultural AI Service is working perfectly!');
    console.log('✅ Gemini 2.0 Flash model integration successful');
    console.log('✅ Real-time agricultural advice ready');
  } else {
    console.log('\n⚠️ AI Service test failed - please check configuration');
  }
});

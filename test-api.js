// Test script to verify Gemini API key is working
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAQMuttFKBjxdZoiIs6d9uGzBML0Ific0Y';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function testAPI() {
  try {
    console.log('Testing Gemini API...');
    const result = await model.generateContent('What is agriculture?');
    const response = result.response;
    const text = response.text();
    console.log('API Test Success!');
    console.log('Response:', text.slice(0, 100) + '...');
    return true;
  } catch (error) {
    console.error('API Test Failed:', error);
    return false;
  }
}

// Export for testing
export default testAPI;

import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI('AIzaSyANi6cqIWNgH_WyNLCnrsbCdzWCAvbA6V4');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
async function run() {
  try {
    const result = await model.generateContent('Hello');
    console.log('Success:', result.response.text());
  } catch (e) {
    console.error('Error:', e.message);
  }
}
run();

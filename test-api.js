import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI('AIzaSyANi6cqIWNgH_WyNLCnrsbCdzWCAvbA6V4');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
async function run() {
  try {
    const result = await model.generateContent('Hello world');
    console.log('Success:', result.response.text());
  } catch (e) {
    console.error('Error:', e.message);
  }
}
run();

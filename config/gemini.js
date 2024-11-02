require("dotenv").config();
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function chatWithGemini(text) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",generationConfig:{responseMimeType:"application/json",}});
    const result = await model.generateContent(text);
    console.log(result.response.text());
    return result.response.text();
}
module.exports = chatWithGemini;
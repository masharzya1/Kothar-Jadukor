import { GoogleGenAI } from '@google/genai';

export default async (req, res) => {
    
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
        
        return res.status(500).json({ error: 'API কী কনফিগার করা হয়নি' });
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    try {
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        const { situation, tone } = req.body;

        if (!situation || !tone) {
            return res.status(400).json({ error: 'পরিস্থিতি এবং টোন উভয়ই প্রয়োজন' });
        }

        const systemInstruction = `You are an extremely skilled and empathetic Bengali communication specialist and creative copywriter. Your primary goal is to analyze the Situation (Context) and the desired Tone provided by the user and generate the single, most appropriate, effective, and engaging message in Bengali. 
        Your strict output rules are as follows: 1. **Language Quality:** The message must be written in fluent, modern, and grammatically perfect Bengali. 2. **Output Format Constraint:** You must not include any greetings, introductory phrases, explanations, or concluding remarks. Start immediately with the generated message text. 3. **Content Delivery:** Deliver only the final message content intended for the user's recipient.`;

        const userQuery = `My objective/situation for writing this message is as follows: ${situation}\nMy desired tone for this message is: ${tone}\n\nGenerate the most suitable message according to this situation and the specified tone.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
            contents: [
                {
                    role: 'user',
                    parts: [{ text: userQuery }]
                }
            ],
        });

        const generatedMessage = response.text || 'বার্তা তৈরি করতে সমস্যা হয়েছে';

        res.status(200).json({ message: generatedMessage });
        
    } catch (error) {
        console.error('Error generating message:', error);
        res.status(500).json({ error: 'বার্তা তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' });
    }
};

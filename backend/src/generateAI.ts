import Groq from 'groq-sdk';

const PROMPT_PREFIX = `Write an article on this topic in proper points and styling in html: `;

async function groqGenerate(apiKey: string, topic: string) {
  const groq = new Groq({ apiKey });
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: `${PROMPT_PREFIX} ${topic}` }],
    model: 'mixtral-8x7b-32768',
  });

  return chatCompletion.choices[0].message.content;
}

export async function generateArticle(text: string, model = "groq", apiKey: string) {
  if (model === "groq") {
    const response = await groqGenerate(apiKey, text);
    return response;
  }
  return "Model not supported";
}

import { Groq } from 'groq-sdk'

const GROQ_API = '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'

const groq = new Groq({
    apiKey: GROQ_API,
    dangerouslyAllowBrowser: true
})

export const requestToGroqAI = async (content: string) => {
    const reply = await groq.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [{ role: 'user', content }],
        max_tokens: 3000,
        temperature: 0.5
    })
    return reply.choices[0].message.content
}

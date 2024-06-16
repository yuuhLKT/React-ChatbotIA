import { Groq } from 'groq-sdk'

const GROQ_API = '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'

const groq = new Groq({
    apiKey: GROQ_API,
    dangerouslyAllowBrowser: true
})

export const requestToGroqAI = async (content: string) => {
    const reply = await groq.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [
            { role: 'system', content: 'Sempre coloque a linguagem de programação junto com markdown ```. NÃO APENAS QUEBRE A LINHA APÓS O NOME DA LINGUAGEM DENTRO DO MARKDOWN. Exemplo: ```csharp, ```typescript, ```javascript, ```java e etc' },
            { role: 'user', content }
        ],
        max_tokens: 3000,
        temperature: 0.5,
    })
    return reply.choices[0].message.content
}

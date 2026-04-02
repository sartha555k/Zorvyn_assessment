import { Transaction } from '../types';
import { MOCK_INSIGHTS, MOCK_AI_CHAT_RESPONSES } from '../data/mockAIResponses';

interface MinimalTransaction {
  date: string;
  amount: number;
  category: string;
  type: string;
}

const mapTransactions = (transactions: Transaction[]): MinimalTransaction[] => {
  return transactions.map(t => ({
    date: t.date,
    amount: t.amount,
    category: t.category,
    type: t.type,
  }));
};

export const generateInsights = async (
  transactions: Transaction[],
  provider: 'gpt' | 'gemini' | 'test',
  apiKey: string | null
) => {
  if (provider === 'test') {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return MOCK_INSIGHTS;
  }

  const minimalTxs = mapTransactions(transactions);

  if (provider === 'gpt') {
    if (!apiKey) throw new Error('API Key is missing.');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: 'Analyze these financial transactions and return a JSON object with: { healthScore: number, anomalies: string[], recommendations: string[] }'
        }, {
          role: 'user',
          content: JSON.stringify(minimalTxs),
        }],
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw new Error('AUTH_ERROR');
      throw new Error('OpenAI API request failed.');
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  if (provider === 'gemini') {
    if (!apiKey) throw new Error('API Key is missing.');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze these transactions and output valid JSON only: { healthScore: number, anomalies: string[], recommendations: string[] }. Data: ${JSON.stringify(minimalTxs)}`
          }]
        }]
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw new Error('AUTH_ERROR');
      throw new Error('Gemini API request failed.');
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  }
};

export const chatWithAI = async (
  message: string,
  transactions: Transaction[],
  history: { role: 'user' | 'assistant', content: string }[],
  provider: 'gpt' | 'gemini' | 'test',
  apiKey: string | null
) => {
  if (provider === 'test') {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_AI_CHAT_RESPONSES[Math.floor(Math.random() * MOCK_AI_CHAT_RESPONSES.length)];
  }

  const minimalTxs = mapTransactions(transactions);

  if (provider === 'gpt') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: `Financial context: ${JSON.stringify(minimalTxs)}` },
          ...history,
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw new Error('AUTH_ERROR');
      throw new Error('OpenAI API request failed.');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  if (provider === 'gemini') {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `System Context: User's financial data: ${JSON.stringify(minimalTxs)}. Message: ${message}`
          }]
        }]
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw new Error('AUTH_ERROR');
      throw new Error('Gemini API request failed.');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }
};

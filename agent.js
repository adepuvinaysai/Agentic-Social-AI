const axios = require('axios');

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

async function requestOpenAI(prompt) {
  if (!OPENAI_KEY) {
    return null;
  }

  const response = await axios.post(
    OPENAI_URL,
    {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful agent that improves user experience and social media content.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 250,
      temperature: 0.8
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`
      }
    }
  );

  return response.data.choices?.[0]?.message?.content?.trim();
}

function fallbackResponse(task, data) {
  if (task === 'social') {
    return `Suggested social media post:\n\nTopic: ${data.topic}\nFormat: ${data.format}\n\nCreate a friendly, values-driven caption that encourages comments, plus 3 hashtags: #AuthenticVoice #AICommunity #UserExperience.`;
  }
  if (task === 'ux') {
    return `UX improvement plan for ${data.area}:\n\n- Simplify navigation labels.\n- Add interactive onboarding tips.\n- Use consistent feedback text for actions.\n- Encourage community responses with clearer CTA buttons.`;
  }
  if (task === 'engagement') {
    return `Engagement advice: Focus on storytelling and a single measurable CTA. Include a question, highlight value clearly, and post at peak times for your audience.`;
  }
  return 'I am ready to help you improve your experience and social presence.';
}

async function generateSocialPostSuggestions({ topic = 'community', format = 'story' }) {
  const prompt = `Generate an engaging social media post idea about ${topic} in ${format} format. Include a short caption, 3 hashtags, and a suggestion for user interaction.`;
  const result = await requestOpenAI(prompt);
  return result || fallbackResponse('social', { topic, format });
}

async function improveUxPlan({ area = 'homepage', audience = 'creators' }) {
  const prompt = `Provide a short UX improvement plan for the ${area} targeted at ${audience}. Keep it actionable with 4 improvements.`;
  const result = await requestOpenAI(prompt);
  return result || fallbackResponse('ux', { area, audience });
}

async function analyzeEngagement({ postText = '', metrics = '' }) {
  const prompt = `Analyze the following social media post and engagement details. Suggest improvements to increase likes, shares, and user response. Post:\n${postText}\nMetrics:\n${metrics}`;
  const result = await requestOpenAI(prompt);
  return result || fallbackResponse('engagement', { postText, metrics });
}

async function buildAgentResponse(type, payload) {
  switch (type) {
    case 'social':
      return { type, result: await generateSocialPostSuggestions(payload) };
    case 'ux':
      return { type, result: await improveUxPlan(payload) };
    case 'engagement':
      return { type, result: await analyzeEngagement(payload) };
    default:
      return { type: 'unknown', result: 'The agent can suggest social posts, provide UX plans, or analyze engagement.' };
  }
}

module.exports = {
  generateSocialPostSuggestions,
  improveUxPlan,
  analyzeEngagement,
  buildAgentResponse
};

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { generateSocialPostSuggestions, improveUxPlan, analyzeEngagement, buildAgentResponse } = require('./agent');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', agent: 'Agentic Social AI' });
});

app.post('/api/agent/action', async (req, res) => {
  try {
    const { type, payload } = req.body;
    const response = await buildAgentResponse(type, payload);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process agent action' });
  }
});

app.get('/api/feeds', (req, res) => {
  const topic = req.query.topic || 'community';
  const feed = [
    {
      id: 1,
      title: `AI-powered social tip for ${topic}`,
      content: `Share a behind-the-scenes story related to ${topic} to boost authenticity.`
    },
    {
      id: 2,
      title: 'Micro-engagement strategy',
      content: 'Ask a one-sentence question in your next post to increase replies and saves.'
    },
    {
      id: 3,
      title: 'Design moment',
      content: 'Use a consistent color palette and simple icons to make your feed feel more polished.'
    }
  ];
  res.json({ topic, feed });
});

app.post('/api/agent/engage', async (req, res) => {
  try {
    const advice = await analyzeEngagement(req.body);
    res.json(advice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to analyze engagement' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Agentic Social AI running at http://localhost:${PORT}`);
});

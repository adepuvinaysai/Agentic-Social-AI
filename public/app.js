const agentResult = document.getElementById('agentResult');
const runAgentButton = document.getElementById('runAgentButton');
const taskType = document.getElementById('taskType');
const topicInput = document.getElementById('topicInput');
const detailsInput = document.getElementById('detailsInput');
const feedTopic = document.getElementById('feedTopic');
const refreshFeedButton = document.getElementById('refreshFeedButton');
const feedList = document.getElementById('feedList');

async function postAgentAction(type, payload) {
  const response = await fetch('/api/agent/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, payload })
  });

  const json = await response.json();
  return json;
}

async function loadFeed(topic) {
  feedList.innerHTML = '<p>Loading feed...</p>';
  const response = await fetch(`/api/feeds?topic=${encodeURIComponent(topic)}`);
  const json = await response.json();
  feedList.innerHTML = '';

  json.feed.forEach(item => {
    const card = document.createElement('div');
    card.className = 'feed-card';
    card.innerHTML = `<h3>${item.title}</h3><p>${item.content}</p>`;
    feedList.appendChild(card);
  });
}

runAgentButton.addEventListener('click', async () => {
  const type = taskType.value;
  const payload = {
    topic: topicInput.value,
    format: type === 'social' ? 'carousel' : undefined,
    area: type === 'ux' ? topicInput.value : undefined,
    postText: type === 'engagement' ? topicInput.value : undefined,
    metrics: type === 'engagement' ? detailsInput.value : undefined,
    audience: type === 'ux' ? detailsInput.value : undefined
  };

  agentResult.textContent = 'Thinking...';

  try {
    const result = await postAgentAction(type, payload);
    agentResult.textContent = result.result || 'No response from the agent.';
  } catch (error) {
    agentResult.textContent = 'Error calling the agent. Please try again.';
  }
});

refreshFeedButton.addEventListener('click', () => loadFeed(feedTopic.value));

window.addEventListener('load', () => {
  loadFeed(feedTopic.value);
});

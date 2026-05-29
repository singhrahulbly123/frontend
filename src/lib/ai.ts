export async function callAiChat(messages: Array<{role: string; content: string}>, options = {}) {
  const res = await fetch('/api/v1/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, options }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI chat request failed: ${res.status} ${text}`);
  }

  return res.json();
}

// Usage example:
// callAiChat([{role: 'user', content: 'Write a short English headline about AI.'}])
//   .then(r => console.log(r))
//   .catch(err => console.error(err));

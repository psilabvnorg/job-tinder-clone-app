import http from 'node:http';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');
const imagesDir = join(publicDir, 'images', 'generated');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://172.18.96.1:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'deepseek-r1:8b';

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

const parseBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString('utf-8');
  return body ? JSON.parse(body) : {};
};

const callOllama = async (prompt) => {
  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: { temperature: 0.7, num_predict: 500 },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data = await response.json();
  return data.response?.trim() || '';
};

const downloadImage = async (query) => {
  await mkdir(imagesDir, { recursive: true });
  const filename = `${query.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.jpg`;
  const outputPath = join(imagesDir, filename);
  const response = await fetch(`https://source.unsplash.com/featured/?${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error(`Image download failed: ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(outputPath, buffer);
  return `/images/generated/${filename}`;
};

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Only POST is supported.' });
  }

  try {
    if (req.url === '/api/generate/post') {
      const { topic = 'learning', imageQuery = 'education' } = await parseBody(req);
      const prompt = `Create a short Instagram-style educational post about ${topic}.
Write 3-5 lines, include one actionable tip, and end with a short motivating sentence.`;
      const content = await callOllama(prompt);
      const image = await downloadImage(imageQuery);
      return sendJson(res, 200, { content, image });
    }

    if (req.url === '/api/generate/quiz') {
      const { topic = 'learning' } = await parseBody(req);
      const prompt = `Generate one multiple-choice quiz question about ${topic}.
Return JSON with fields: question, options (array of {label, text}), correctLabel, explanation, commentPrompt.`;
      const response = await callOllama(prompt);
      return sendJson(res, 200, { raw: response });
    }

    return sendJson(res, 404, { error: 'Route not found.' });
  } catch (error) {
    return sendJson(res, 500, { error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

const port = process.env.PORT || 4171;
server.listen(port, () => {
  console.log(`EduGram generator server running on http://localhost:${port}`);
});

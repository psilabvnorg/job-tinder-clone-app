const CONTENT_SERVICE_URL = import.meta.env.VITE_CONTENT_SERVICE_URL || 'http://localhost:4171';

export interface GeneratedPostResponse {
  content: string;
  image: string;
}

export interface GeneratedQuizResponse {
  raw: string;
}

export async function generatePost(topic: string, imageQuery: string): Promise<GeneratedPostResponse> {
  const response = await fetch(`${CONTENT_SERVICE_URL}/api/generate/post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, imageQuery }),
  });

  if (!response.ok) {
    throw new Error(`Content service error: ${response.status}`);
  }

  return response.json();
}

export async function generateQuiz(topic: string): Promise<GeneratedQuizResponse> {
  const response = await fetch(`${CONTENT_SERVICE_URL}/api/generate/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    throw new Error(`Content service error: ${response.status}`);
  }

  return response.json();
}

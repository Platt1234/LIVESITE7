export function validateRequestBody(body: unknown): {
  name: string;
  email: string;
  type: string;
  otherType?: string;
  query: string;
} {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }

  const data = body as Record<string, unknown>;

  if (!data.name || typeof data.name !== 'string') {
    throw new Error('Name is required');
  }

  if (!data.email || typeof data.email !== 'string') {
    throw new Error('Email is required');
  }

  if (!data.type || typeof data.type !== 'string') {
    throw new Error('Type is required');
  }

  if (!data.query || typeof data.query !== 'string') {
    throw new Error('Query is required');
  }

  return {
    name: data.name,
    email: data.email,
    type: data.type,
    otherType: typeof data.otherType === 'string' ? data.otherType : undefined,
    query: data.query
  };
}
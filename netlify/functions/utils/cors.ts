export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function createResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body)
  };
}
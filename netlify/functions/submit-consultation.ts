import { Handler } from '@netlify/functions';
import { corsHeaders, createResponse } from './utils/cors';
import { sendConsultationEmail } from './utils/email';
import { validateRequestBody } from './utils/validation';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(204, null);
  }

  try {
    if (event.httpMethod !== 'POST') {
      return createResponse(405, { 
        success: false,
        error: 'Method not allowed' 
      });
    }

    if (!event.body) {
      return createResponse(400, { 
        success: false,
        error: 'Request body is required' 
      });
    }

    // Parse and validate request body
    const rawData = JSON.parse(event.body);
    const data = validateRequestBody(rawData);

    // Send email
    await sendConsultationEmail(data);
    
    return createResponse(200, {
      success: true,
      message: 'Consultation request submitted successfully'
    });
  } catch (error) {
    console.error('Server error:', error);
    
    return createResponse(500, {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
};
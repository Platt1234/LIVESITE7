import { ConsultationFormData } from '../../types/consultation';
import { validateFormData } from '../validation/formValidation';

const API_URL = process.env.NODE_ENV === 'production'
  ? '/api/submit-consultation'  // Production Vercel API route
  : '/api/submit-consultation'; // Local development

export async function submitConsultation(data: ConsultationFormData): Promise<void> {
  try {
    // Validate form data before submission
    validateFormData(data);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    let result;
    const text = await response.text();

    try {
      result = text ? JSON.parse(text) : null;
    } catch (e) {
      throw new Error('Invalid server response');
    }

    if (!result) {
      throw new Error('Empty response from server');
    }

    if (!response.ok || !result.success) {
      throw new Error(result.error || `Request failed: ${response.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred');
  }
}
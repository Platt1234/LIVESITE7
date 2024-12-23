import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { validateFormData } from '../src/utils/validation/formValidation';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    if (!req.body) {
      throw new Error('Request body is required');
    }

    // Validate request data
    validateFormData(req.body);

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    await transporter.verify();

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: ['joseph@platteneye.co.uk', 'daniel@platteneye.co.uk'],
      subject: `New Consultation Request from ${req.body.name}`,
      html: `
        <h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${req.body.name}</p>
        <p><strong>Email:</strong> ${req.body.email}</p>
        <p><strong>Type:</strong> ${req.body.type === 'other' ? req.body.otherType : req.body.type}</p>
        <p><strong>Query:</strong></p>
        <p>${req.body.query.replace(/\n/g, '<br>')}</p>
      `
    });

    return res.status(200).json({
      success: true,
      message: 'Consultation request submitted successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}
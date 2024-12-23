export function validateFormData(data: {
  name: string;
  email: string;
  type: string;
  otherType?: string;
  query: string;
}) {
  if (!data.name?.trim()) {
    throw new Error('Name is required');
  }

  if (!data.email?.trim()) {
    throw new Error('Email is required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Invalid email format');
  }

  if (!data.type?.trim()) {
    throw new Error('Type is required');
  }

  if (data.type === 'other' && !data.otherType?.trim()) {
    throw new Error('Please specify the type');
  }

  if (!data.query?.trim()) {
    throw new Error('Query is required');
  }
}
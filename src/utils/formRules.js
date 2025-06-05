export const requiredRule = (value) => {
  return !!value || 'This field is required'
}
export const requiredArrayRule = (value) => {
  return (Array.isArray(value) && value.length > 0) || 'At least one item is required'
}
export const emailRule = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  return emailRegex || 'Please enter a valid email address';
}

export const passwordRule = (value) => {
  if (!value) return 'This field is required'
  if (value.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter'
  if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter'
  if (!/[0-9]/.test(value)) return 'Password must contain at least one number'
  return true
}

export const phoneRule = (value) => {
  const phoneRegex = /^\+?[1-9]\d{1,10}$/.test(value)
  return phoneRegex || 'Please enter a valid phone number'
}

export const numberRule = (value) => {
  const num = Number(value)
  return !isNaN(num) && isFinite(num) || 'Please enter a valid number'
}

export const minRule = (min) => (value) => {
  return value.length >= min || `Minimum ${min} characters required`
}

export const maxRule = (max) => (value) => {
  return value.length <= max || `Maximum ${max} characters allowed`
}

export const minLengthRule = (value, min) => {
  return value.length >= min || `Minimum ${min} characters required`
}

export const maxLengthRule = (value, max) => {
  return value?.length <= max || `Maximum ${max} characters allowed`
}

export const urlRule = (value) => {
  const urlRegex = /^(http|https):\/\/[a-zA-Z0-9.-]+(?:\/[a-zA-Z0-9()@:%_+.,~#?&//=]*)?$/.test(value)
  return urlRegex || 'Please enter a valid URL'
}

export const alphaRule = (value) => {
  return /^[A-Za-z]+$/.test(value) || 'Only alphabetic characters allowed'
}

export const alphaNumRule = (value) => {
  return /^[A-Za-z0-9]+$/.test(value) || 'Only alphanumeric characters allowed'
}

export const customRule = (message) => (value) => {
  return value || message
}


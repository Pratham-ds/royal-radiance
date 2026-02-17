export const validateNumber = (value: string, min: number = 0, max: number = 999999): number | null => {
  const num = parseFloat(value);
  if (isNaN(num) || num < min || num > max) return null;
  return num;
};

export const validateInteger = (value: string, min: number = 0, max: number = 999999): number | null => {
  const num = parseInt(value, 10);
  if (isNaN(num) || num < min || num > max) return null;
  return num;
};

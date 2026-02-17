export const mapDatabaseError = (error: any): string => {
  const message = error?.message || '';
  
  if (message.includes('duplicate')) return 'This item already exists';
  if (message.includes('foreign key')) return 'Unable to complete — item is referenced elsewhere';
  if (message.includes('permission denied')) return 'Access denied';
  if (message.includes('violates')) return 'Invalid data provided';
  if (message.includes('not found')) return 'Item not found';
  if (message.includes('timeout')) return 'Request timed out. Please try again';
  
  return 'An unexpected error occurred. Please try again.';
};

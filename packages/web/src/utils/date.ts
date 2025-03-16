export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}; 
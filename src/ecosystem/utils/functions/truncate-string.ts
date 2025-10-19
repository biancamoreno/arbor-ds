export const truncateString = (value: string, maximumCharacters: number) => {
  if (!value) return '';

  if (maximumCharacters <= 0) return '';
  return value.slice(0, maximumCharacters);
};

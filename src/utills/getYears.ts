export const getYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: currentYear - 1990 + 1 }, (_, i) =>
    (1990 + i).toString(),
  );
};

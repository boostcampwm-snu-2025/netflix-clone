export const formatBadgeNumber = (value) => {
  const num = parseInt(value, 10);

  if (isNaN(num) || num < 0) {
    return 0;
  }

  if (num > 99) {
    return "99+";
  }

  return num;
};

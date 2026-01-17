const formatDateRange = (start?: Date, end?: Date) => {
  if (!start || !end) return null;
  return `${start.toDateString()} - ${end.toDateString()}`;
};
export default formatDateRange;

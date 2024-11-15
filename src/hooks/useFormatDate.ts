const useFormatDate = (timestamp: any) => {
  // Verifica si date es una instancia válida de Date
  if (timestamp instanceof Date) {
    return timestamp.toISOString().split('T')[0]; // Convierte a formato "YYYY-MM-DD"
  }
  const date = new Date(timestamp.seconds * 1000);
  return date.toISOString().split('T')[0] || '';
};

export default useFormatDate;

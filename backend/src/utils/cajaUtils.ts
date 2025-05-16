// Función auxiliar para obtener fecha y hora actual de Perú NO FUNCIONA AAHHHHHHH :(
export function getPeruDateTime(): string {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const peruTime = new Date(utcTime - 5 * 60 * 60000); // UTC-5
  return peruTime.toISOString().slice(0, 19).replace("T", " "); // formato SQL DATETIME
}

export function formatarData(valor: string) {
  const data = new Date(valor.length === 10 ? `${valor}T12:00:00` : valor);
  if (Number.isNaN(data.getTime())) return valor;
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

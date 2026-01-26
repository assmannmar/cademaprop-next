export function calcularOpciones(
  lotes: any[],
  anticipoUsuario: number,
  cuotaUsuario: number
) {
  const accesibles = lotes.filter(lote =>
    lote.disponible &&
    lote.anticipo <= anticipoUsuario &&
    lote.cuota <= cuotaUsuario
  );

  accesibles.sort((a, b) => a.anticipo - b.anticipo);

  return accesibles;
}

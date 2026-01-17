/**
 * Genera las iniciales del email del usuario.
 * Toma las primeras letras antes del @ y las convierte a mayúsculas.
 * Ejemplo: "john.doe@example.com" -> "JD"
 */
export function getInitialsFromEmail(email: string): string {
  if (!email) return "U";

  const localPart = email.split("@")[0];
  const parts = localPart.split(/[._-]/);

  if (parts.length >= 2) {
    // Si hay múltiples partes, toma la primera letra de las primeras dos
    return (parts[0][0] || "").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
  }

  // Si solo hay una parte, toma las primeras dos letras
  return localPart.substring(0, 2).toUpperCase();
}

/**
 * Extrae un nombre legible del email.
 * Ejemplo: "john.doe@example.com" -> "John Doe"
 */
export function getNameFromEmail(email: string): string {
  if (!email) return "Usuario";

  const localPart = email.split("@")[0];
  const parts = localPart.split(/[._-]/);

  if (parts.length >= 2) {
    // Capitaliza cada parte
    return parts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  }

  // Si solo hay una parte, capitaliza la primera letra
  return localPart.charAt(0).toUpperCase() + localPart.slice(1).toLowerCase();
}

import { siteConfig } from "../config/site";

/**
 * Link de WhatsApp con mensaje prellenado.
 * Devuelve null si todavía no se configuró el número en `siteConfig.contact.whatsapp`.
 */
export function whatsappLink(message?: string): string | null {
  const number = siteConfig.contact.whatsapp.replace(/\D/g, "");
  if (!number) return null;

  const text = encodeURIComponent(message ?? siteConfig.contact.whatsappMessage);
  return `https://wa.me/${number}?text=${text}`;
}

export function mailtoLink(subject: string, body?: string): string {
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);
  return `mailto:${siteConfig.contact.email}?${params.toString()}`;
}

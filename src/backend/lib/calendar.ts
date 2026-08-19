/**
 * Generates a "Add to Google Calendar" URL for students.
 * No auth needed — students just click the link.
 */
export function buildGoogleCalendarLink(params: {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
}): string {
  const { title, description, date, time, durationMinutes } = params;

  // Parse start datetime in Montevideo time (UTC-3)
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  const startUTC = new Date(Date.UTC(year, month - 1, day, hour + 3, minute));
  const endUTC = new Date(startUTC.getTime() + durationMinutes * 60 * 1000);

  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

  const params_ = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: description,
    dates: `${fmt(startUTC)}/${fmt(endUTC)}`,
    ctz: "America/Montevideo",
  });

  return `https://calendar.google.com/calendar/render?${params_.toString()}`;
}

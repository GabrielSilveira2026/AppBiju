export function formatMinutesToHours(totalMinutes: number) {
    const roundedMinutes = Math.floor(totalMinutes); // Trunca para um inteiro
    const hours = Math.floor(roundedMinutes / 60);
    const minutes = roundedMinutes % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}

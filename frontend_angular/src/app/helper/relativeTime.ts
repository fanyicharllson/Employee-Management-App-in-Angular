
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay === 0) {
    if (diffHour === 0) {
      if (diffMin < 2) return 'just now';
      return `${diffMin} minutes ago`;
    }
    return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  }
  if (diffDay === 1) return '1 day ago';
  if (diffDay < 7) return `${diffDay} days ago`;

  const diffMonth = now.getMonth() - date.getMonth() + (12 * (now.getFullYear() - date.getFullYear()));
  if (diffMonth === 1) return 'last month';
  if (diffMonth > 1) return `${diffMonth} months ago`;

  return date.toLocaleDateString(); // fallback
}
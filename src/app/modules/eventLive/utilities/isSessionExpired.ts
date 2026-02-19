const MAX_SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
export const isSessionExpired = (session: any) => {
  if (!session.startedAt) return false;

  return (
    Date.now() - new Date(session.startedAt).getTime() > MAX_SESSION_DURATION
  );
};

export const ensureSpeaker = (activeRole: string) => {
  if (activeRole !== "SPEAKER") {
    throw new Error("Only speaker allowed");
  }
};

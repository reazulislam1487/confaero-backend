export const ensureSpeaker = (role: string) => {
  if (role !== "SPEAKER") {
    throw new Error("Only speaker can perform this action");
  }
};

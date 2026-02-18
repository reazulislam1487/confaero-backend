export type TZegoRole = "SPEAKER" | "ATTENDEE";

export interface IZegoTokenPayload {
  userId: string;
  role: TZegoRole;
  sessionId: string;
}

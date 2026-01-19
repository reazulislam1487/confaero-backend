import jwt from "jsonwebtoken";
import { TQrPayload } from "../../modules/qr/qr.interface";

export const verifyQrToken = (token: string): TQrPayload | null => {
  try {
    return jwt.verify(token, process.env.QR_SECRET as string) as TQrPayload;
  } catch {
    return null;
  }
};

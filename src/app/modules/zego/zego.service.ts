import { generateZegoToken } from "./utils";
import { IZegoTokenPayload } from "./zego.interface";
// ⬆️ তুমি আগেই generateZegoToken বানিয়েছো

const get_zego_token = ({ userId, role, sessionId }: IZegoTokenPayload) => {
  const token = generateZegoToken(userId, role, sessionId);

  return {
    token,
    appId: process.env.ZEGO_APP_ID,
  };
};

export const zego_service = {
  get_zego_token,
};

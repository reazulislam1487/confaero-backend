import qr from "qrcode";

export const generateQRCode = async (text: string): Promise<string> => {
  try {
    const qrCodeDataURL = await qr.toDataURL(text);
    console.log(qrCodeDataURL);
    return qrCodeDataURL;
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
};

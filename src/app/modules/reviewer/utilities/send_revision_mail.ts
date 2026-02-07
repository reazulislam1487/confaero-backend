import sendMail from "../../../utils/mail_sender";
import { poster_model } from "../../poster/poster.schema";
import { UserProfile_Model } from "../../user/user.schema";

export const send_revision_mail = async (
  posterId: any,
  attachmentId: any,
  reason: any,
) => {
  // 1. Poster + Author accountId বের করো
  const poster = await poster_model
    .findById(posterId, {
      authorId: 1,
      title: 1,
    })
    .lean();

  // 2. Author profile থেকে email নাও
  const authorProfile = await UserProfile_Model.findOne(
    { accountId: poster!.authorId },
    { contact: 1, name: 1 },
  ).lean();

  const email = authorProfile?.contact?.email;

  if (!email) {
    throw new Error("Author email not found");
  }
  console.log(email);
  // 3. Simple email
  await sendMail({
    to: email,
    subject: "Poster Revision Required",
    textBody: "here is the text",
    htmlBody: `
     ${authorProfile!.name},<br/><br/>

      Your poster "<b>${poster?.title}</b>" requires revision.<br/>
      <b>Reason:</b> ${reason}<br/><br/>

      Please log in to your dashboard and update the poster.<br/><br/>

      Thanks
    `,
  });
};

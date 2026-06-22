import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactEmail = createServerFn({
  method: "POST",
})
  .validator(
    z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      subject: z.string(),
      message: z.string(),
    })
  )
  .handler(async ({ data }) => {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "kkuhmano@gmail.com",
      subject: `Nouveau message : ${data.subject}`,
      html: `
        <h2>Nouveau message depuis JURIS-CONSULTANT</h2>
        <p><strong>Nom :</strong> ${data.name}</p>
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>Téléphone :</strong> ${data.phone}</p>
        <p><strong>Objet :</strong> ${data.subject}</p>
        <p><strong>Message :</strong></p>
        <p>${data.message}</p>
      `,
    });
    return { success: true };
  });

const { saveProspect } = await import("./prospects.server");

export const sendContactEmailAndSave = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional().default(""),
      subject: z.string().optional().default(""),
      message: z.string().min(1),
    })
  )
  .handler(async ({ data }) => {
    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "kkuhmano@gmail.com",
        subject: `Nouveau prospect : ${data.subject || data.name}`,
        html: `
          <h2>Nouveau prospect depuis JURIS-CONSULTANT</h2>
          <p><strong>Nom :</strong> ${data.name}</p>
          <p><strong>Email :</strong> ${data.email}</p>
          <p><strong>Téléphone :</strong> ${data.phone || "—"}</p>
          <p><strong>Sujet :</strong> ${data.subject || "—"}</p>
          <p><strong>Message :</strong></p>
          <p>${data.message}</p>
        `,
      });
    } catch (err) {
      console.error("Erreur envoi email prospect :", err);
    }

    try {
      await saveProspect({ data: { ...data, source: "contact" } });
    } catch (err) {
      console.error("Erreur sauvegarde prospect :", err);
    }

    return { success: true };
  });
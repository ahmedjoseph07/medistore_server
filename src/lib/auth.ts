import { betterAuth, string } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer"
import config from "../config/env";
import { getVerificationEmailTemplate } from "./emailVerificationTemplate";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: config.app_user,
        pass: config.app_pass,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    user: {
        additionalFields: {
            role: {
                type: "string"
            },
            phone: {
                type: "string"
            },
            isBanned: {
                type: "boolean"
            }
        }
    },
    trustedOrigins: [process.env.APP_URL!],
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationUrl = `${config.app_url}/api/auth/verify-email?token=${token}`;
                const info = await transporter.sendMail({
                    from: '"Medistore" <medistore@support.com>',
                    to: user.email,
                    subject: "Verify your Medistore email",
                    text: `Verify your email: ${verificationUrl}`,
                    html: getVerificationEmailTemplate(verificationUrl, user.name),
                });

            } catch (err) {
                console.error(err)
                throw err
            }
        }
    },
    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: config.client_id as string,
            clientSecret: config.client_secret as string
        }
    }

});
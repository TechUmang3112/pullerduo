import * as env from 'dotenv';

env.config();

export const Env = {
  thirdParty: {
    google: {
      maps_key: process.env.GOOGLE_API_KEY,
    },
    mailJet: {
      apiKey: process.env.MAIL_JET_API_KEY,
      secretKey: process.env.MAIL_JET_SECRET_KEY,
    },
    razorpay: {
      appId: process.env.RAZORPAY_APP_ID,
      secretKey: process.env.RAZORPAY_APP_SECRET,
    },
  },
};

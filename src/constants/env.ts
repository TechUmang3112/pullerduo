import * as env from 'dotenv';

env.config();

export const Env = {
  thirdParty: {
    google: {
      maps_key: process.env.GOOGLE_API_KEY,
    },
  },
};

console.log({ Env });

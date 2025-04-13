// Imports
import { Env } from './env';

export const nGoogle = {
  placesSearch: `https://places.googleapis.com/v1/places:searchText?key=${Env.thirdParty.google.maps_key}`,
  measureDistance: `https://routes.googleapis.com/directions/v2:computeRoutes?key=${Env.thirdParty.google.maps_key}`,
};

export const nMailJet = {
  baseUrl: 'https://api.mailjet.com/v3.1/send',
};

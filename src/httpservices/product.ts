import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL

export function getProduct(name?: string) {
    const response = axios.get(`${baseUrl}/produto/?q={"$orderby":{"nome":"asc"}}`).catch(function (error) {
      return {status: 571}
      if (error.response) {
        return error.response

      } else if (error.request) {
        return error.request;

      } else {
        return error.message;

      }
    });
  return response
}

export async function postProduct(url: string) {
    const response = await axios.post(url).catch(function (error) {
        return {status: 571}
        if (error.response) {
          return error.response

        } else if (error.request) {
          return error.request;

        } else {
          return error.message;

        }
      });
    return response
}
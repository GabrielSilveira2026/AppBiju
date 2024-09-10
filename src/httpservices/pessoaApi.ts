import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL 

export function login(email: string, senha: string) {
    const response = axios.get(`${baseUrl}/login/${email}?senha=${senha}`).catch(function (error) {
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
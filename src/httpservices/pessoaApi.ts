import axios from "axios";
import { UserType } from "../types/types";
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL

export function login(email: string, senha: string) {
  const response = axios.get(`${baseUrl}/login/${email}?senha=${senha}`).catch(function (error) {
    return { status: 571 }
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

export async function register(userData: Omit<UserType, "id_pessoa" | "perfil">) {
  const response = await axios.post(`${baseUrl}/pessoa/?email=${userData.email}&id_perfil=${userData.id_perfil}&senha=${userData.senha}&nome=${userData.nome}`).catch(function (error) {
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
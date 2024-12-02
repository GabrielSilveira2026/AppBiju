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

export async function updatePeople(userData: Partial<UserType> & { id_pessoa: number }) {
  const response = await axios.put(`${baseUrl}/pessoa/${userData.id_pessoa}`, userData).catch(function (error) {
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

export function getPeople(id_pessoa?: number) {

  const query = id_pessoa ? `,"id_pessoa":${id_pessoa}` : "";

  const response = axios.get(`${baseUrl}/pessosa/?q={"$orderby":{"nome":"asc"}${query}}`).catch(function (error) {
    return { data: [], status: 571 };
    // if (error.response) {
    //   console.log(error.response)

    // } else if (error.request) {
    //   console.log(error.request)

    // } else {
    //   console.log(error.message)
    // }
  });
  return response;
}

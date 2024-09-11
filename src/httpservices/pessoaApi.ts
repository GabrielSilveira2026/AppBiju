import axios from "axios";
import { PessoaType } from "../types/types";
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

export async function cadastro(dadosPessoa: Omit<PessoaType, "id_pessoa" | "perfil">) {
  const response = await axios.post(`${baseUrl}/pessoa/?email=${dadosPessoa.email}&id_perfil=${dadosPessoa.id_perfil}&senha=${dadosPessoa.senha}&nome=${dadosPessoa.nome}`).catch(function (error) {
    // return { status: 571 }
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
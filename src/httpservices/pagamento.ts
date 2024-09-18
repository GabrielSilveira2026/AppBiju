import axios from "axios";
import { UserType } from "../types/types";
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL

export function consultPending(id_pessoa?: number) {
    const response = axios.get(`${baseUrl}/pagamento/pendente/?q={"id_pessoa":${id_pessoa}}`).catch(function (error) {
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
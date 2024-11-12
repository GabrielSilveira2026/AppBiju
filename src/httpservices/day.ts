import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL

export function getDay(id_pessoa?: number, page?: number) {
    const sizePage = 30

    const offset = page ? `&offset=${page * sizePage}` : ""

    const query = id_pessoa ? `,"id_pessoa":${id_pessoa}}` : "}"

    const response = axios.get(`${baseUrl}/dia/geral/?q={"$orderby":{"data_dia_producao":  "desc"}${query}${offset}`).catch(function (error) {
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
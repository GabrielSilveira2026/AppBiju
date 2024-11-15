import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL

export function getDay(page: number, id_pessoa?: number) {

    const query = id_pessoa ? `,"id_pessoa":${id_pessoa}}` : "}"

    const response = axios.get(`${baseUrl}/dia/geral/?q={"$orderby":{"data_dia_producao":  "desc"}${query}&offset=${30 * page}`).catch(function (error) {
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
import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL

export function getDay(id_pessoa?: number) {

    const query = id_pessoa ? `,"id_pessoa":${id_pessoa}}` : ""

    const response = axios.get(`${baseUrl}/dia/geral/?q={"$orderby":{"data_dia_producao":  "desc"}${query}`).catch(function (error) {
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

export function postDay(id_pessoa: number, data_dia_producao: string) {
    const response = axios.post(`${baseUrl}/dia/?id_pessoa=${id_pessoa}&data_dia_producao=${data_dia_producao}`).catch(function (error) {
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
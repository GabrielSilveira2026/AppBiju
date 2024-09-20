import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL

export function getDay(id_pessoa?: number) {

    const query = id_pessoa? `?q={"id_pessoa":${id_pessoa}}` : ""

    const response = axios.get(`${baseUrl}/dia/geral/${query}`).catch(function (error) {
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
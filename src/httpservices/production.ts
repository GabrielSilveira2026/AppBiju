import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL

export function getProduction(id_dia?: string){

    const query = id_dia ? `?q={"id_dia":"${id_dia}"}` : ""

    const response = axios.get(`${baseUrl}/producao/${query}`).catch(function (error) {
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
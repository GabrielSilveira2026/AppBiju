import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL

export function getParam(nome_parametro?: string) {

    const query = nome_parametro ? `?q={"descricao":{"$like":"${nome_parametro}"}}` : ""
    
    const response = axios.get(`${baseUrl}/parametro/${query}`).catch(function (error) {
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
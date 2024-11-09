import axios from "axios";
import { UserType } from "../types/types";
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL

export function getPending(id_pessoa?: number) {
    const query = id_pessoa ? `&q={"id_pessoa":${id_pessoa}}` : ""

    const response = axios.get(`${baseUrl}/pagamento/pendente/?q={"$orderby":{"nome":"asc"}}${query}`).catch(function (error) {
        return { data: null, status: 571 }
        // if (error.response) {
        //     return error.response

        // } else if (error.request) {
        //     return error.request;

        // } else {
        //     return error.message;

        // }
    });

    return response
}

export function getPayment(id_pessoa?: number) {
    const query = id_pessoa ? `&q={"id_pessoa":${id_pessoa}}` : ""

    const response = axios.get(`${baseUrl}/pagamento/?q={"$orderby":{"data_pagamento":"desc"}}${query}`).catch(function (error) {
        return { data: null, status: 571 }
    });

    return response
}
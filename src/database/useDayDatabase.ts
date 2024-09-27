
import { useSQLiteContext } from "expo-sqlite";
import { DayType } from "../types/types";

export default function useDayDatabase() {

    const database = useSQLiteContext()

    async function getDay() {
        try {
            const result = "SELECT * FROM dia ORDER BY data_dia_producao DESC"

            const response = await database.getAllAsync<DayType>(result)

            return response
        } catch (error) {
            throw error
        }
    }

    return { getDay }
}
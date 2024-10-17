import { useSQLiteContext } from "expo-sqlite";
import { ProductionType } from "../types/types";

export default function useProductionDatabase() {
    const database = useSQLiteContext();

    async function getProduction(id_dia?: number) {
        try {
            const result = id_dia
                ? `SELECT * FROM producao WHERE id_dia = $id_dia ORDER BY id_producao DESC`
                : `SELECT * FROM producao ORDER BY id_producao`;
    
            const response = id_dia
                ? await database.getAllAsync(result, { $id_dia: id_dia })
                : await database.getAllAsync(result);
    
            return response;
        } catch (error) {
            throw error;
        }
    }
    
    return { getProduction};
}

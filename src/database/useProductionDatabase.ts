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
    
    async function postProduction(production: ProductionType) {
        const statement = await database.prepareAsync(`
            INSERT INTO producao (
                id_producao,
                id_dia,
                id_produto,
                quantidade,
                observacao,
                historico_preco_unidade
            )
            VALUES (
                $id_producao,
                $id_dia,
                $id_produto,
                $quantidade,
                $observacao,
                $historico_preco_unidade
            )
        `)
    
        try {
            const result = await statement.executeAsync({
                $id_producao: production.id_producao,
                $id_dia: production.id_dia,
                $id_produto: production.id_produto,
                $quantidade: production.quantidade,
                $observacao: production.observacao,
                $historico_preco_unidade: production.historico_preco_unidade
            })
    
            const insertedRowId = result.lastInsertRowId.toLocaleString()
    
            const response = await database.getAllAsync<ProductionType>(`SELECT * FROM producao WHERE rowid = ${insertedRowId}`)
    
            return response
    
        } catch (error) {
            throw error
        } finally {
            await statement.finalizeAsync()
        }
    }
    

    return { getProduction, postProduction };
}

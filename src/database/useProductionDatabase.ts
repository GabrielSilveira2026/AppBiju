import { useSQLiteContext } from "expo-sqlite";
import { ProductionType } from "../types/types";

export default function useProductionDatabase() {
    const database = useSQLiteContext();

    async function getProduction(id_producao?: string) {
        try {
            const query = id_producao
                ? `
                    SELECT 
                        p.id_producao, 
                        p.id_dia, 
                        p.id_produto, 
                        pr.nome AS nome_produto,
                        pr.tempo_minuto,
                        p.quantidade, 
                        p.observacao, 
                        p.historico_preco_unidade
                    FROM 
                        producao p
                    INNER JOIN 
                        produto pr ON p.id_produto = pr.id_produto
                    WHERE 
                        p.id_producao = $id_producao
                    ORDER BY 
                        p.id_producao DESC
                `
                : `
                    SELECT 
                        p.id_producao, 
                        p.id_dia, 
                        p.id_produto, 
                        pr.nome AS nome_produto,
                        pr.tempo_minuto,
                        p.quantidade, 
                        p.observacao, 
                        p.historico_preco_unidade
                    FROM 
                        producao p
                    INNER JOIN 
                        produto pr ON p.id_produto = pr.id_produto
                    ORDER BY 
                        p.id_producao DESC
                `;
    
            const response = id_producao
                ? await database.getAllAsync(query, { $id_producao: id_producao })
                : await database.getAllAsync(query);
    
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
    
    async function updateProductionList(productionList: ProductionType[]) {
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
        `);
    
        const statementDelete = await database.prepareAsync(`DELETE FROM producao`);
        try {
            await statementDelete.executeAsync();
        } catch (error) {
            throw error;
        } finally {
            await statementDelete.finalizeAsync();
        }
    
        try {
            for await (const production of productionList) {
                await statement.executeAsync({
                    $id_producao: production.id_producao,
                    $id_dia: production.id_dia,
                    $id_produto: production.id_produto,
                    $quantidade: production.quantidade,
                    $observacao: production.observacao || null,
                    $historico_preco_unidade: production.historico_preco_unidade
                });
            }
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }
    

    return { getProduction, postProduction, updateProductionList };
}

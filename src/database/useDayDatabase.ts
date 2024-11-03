
import { useSQLiteContext } from "expo-sqlite";
import { DayType } from "../types/types";

export default function useDayDatabase() {

    const database = useSQLiteContext()

    async function getDay(id_pessoa?: number) {
        
        try {
            const result = id_pessoa
                ? `
                    SELECT 
                        d.ID_dia,
                        d.ID_PESSOA,
                        p.NOME AS Nome_Pessoa,
                        d.DATA_dia_producao,
                        IFNULL(SUM(pr.QUANTIDADE * pr.historico_preco_unidade), 0) AS valor_dia
                    FROM 
                        dia d
                    INNER JOIN 
                        pessoa p ON p.ID_PESSOA = d.ID_PESSOA
                    LEFT JOIN 
                        producao pr ON pr.ID_dia = d.ID_dia
                    WHERE 
                        d.ID_PESSOA = $id_pessoa
                    GROUP BY 
                        d.ID_dia, 
                        d.ID_PESSOA, 
                        p.NOME, 
                        d.DATA_dia_producao
                    ORDER BY 
                        d.DATA_dia_producao DESC
                  `
                : `SELECT * FROM dia ORDER BY data_dia_producao DESC`;
    
            const response = id_pessoa
                ? await database.getAllAsync<DayType>(result, { $id_pessoa: id_pessoa })
                : await database.getAllAsync<DayType>(result);
    
            return response;
        } catch (error) {
            throw error;
        }
    }
    
    async function postDay(dia: DayType) {
        const statement = await database.prepareAsync(`
            INSERT INTO dia (
                id_dia,
                id_pessoa,
                data_dia_producao
            )
            VALUES (
                $id_dia,
                $id_pessoa,
                $data_dia_producao
            )
        `);

        try {
            const result = await statement.executeAsync({
                $id_dia: dia.id_dia,
                $id_pessoa: dia.id_pessoa,
                $data_dia_producao: dia.data_dia_producao
            });

            const insertedRowId = result.lastInsertRowId.toLocaleString()

            const response = await database.getAllAsync<DayType>(`SELECT * FROM dia WHERE rowid = ${insertedRowId}`)

            return response
        } catch (error) {
            console.error("Erro ao criar dia:", error);
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function updateDay(dia: DayType) {
        const statement = await database.prepareAsync(`
            UPDATE dia
            SET
                id_pessoa = $id_pessoa,
                data_dia_producao = $data_dia_producao
            WHERE
                id_dia = $id_dia
        `);
    
        try {
            const result = await statement.executeAsync({
                $id_dia: dia.id_dia,
                $id_pessoa: dia.id_pessoa,
                $data_dia_producao: dia.data_dia_producao
            });

            const updatedResponse = await database.getAllAsync<DayType>(
                `SELECT * FROM dia WHERE id_dia = $id_dia`,
                { $id_dia: dia.id_dia }
            );
    
            return updatedResponse;
        } catch (error) {
            console.error("Erro ao atualizar dia:", error);
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }
    

    async function updateDiaList(diaList: DayType[], id_pessoa?: number) {

        const statementDelete = id_pessoa
            ? await database.prepareAsync(`DELETE FROM dia WHERE id_pessoa = $id_pessoa`)
            : await database.prepareAsync(`DELETE FROM dia`);

        try {
            if (id_pessoa) {
                await statementDelete.executeAsync({ $id_pessoa: id_pessoa });
            } else {
                await statementDelete.executeAsync();
            }
        } catch (error) {
            throw error;
        } finally {
            await statementDelete.finalizeAsync();
        }

        const statementInsert = await database.prepareAsync(`
            INSERT INTO dia (
                id_dia,
                id_pessoa,
                data_dia_producao
            )
            VALUES (
                $id_dia,
                $id_pessoa,
                $data_dia_producao
            )
        `);

        try {
            for await (const dia of diaList) {
                await statementInsert.executeAsync({
                    $id_dia: dia.id_dia || null,
                    $id_pessoa: dia.id_pessoa,
                    $data_dia_producao: dia.data_dia_producao
                });
            }
        } catch (error) {
            throw error;
        } finally {
            await statementInsert.finalizeAsync();
        }
    }

    return { getDay, updateDay, updateDiaList, postDay }
}
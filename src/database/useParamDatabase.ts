import { useSQLiteContext } from "expo-sqlite";
import { ParamType } from "../types/types";

export default function useParamDatabase() {
    const database = useSQLiteContext();

    async function getParam(nome_parametro?: string) {
        try {
            const result = nome_parametro
                ? `SELECT * FROM parametro WHERE descricao LIKE $nome_parametro`
                : `SELECT * FROM parametro`;
    
            const response = nome_parametro
                ? await database.getAllAsync(result, { $nome_parametro: `%${nome_parametro}%` })
                : await database.getAllAsync(result);
    
            return response;
        } catch (error) {
            throw error;
        }
    }
    

    async function updateParamList(paramList: ParamType[], id_parametro?: number) {
        const statementDelete = await database.prepareAsync(`DELETE FROM parametro`);

        try {
            await statementDelete.executeAsync()
        } catch (error) {
            throw error
        } finally {
            await statementDelete.finalizeAsync()
        }

        const statement = await database.prepareAsync(`
            INSERT INTO parametro (
                id_parametro,
                descricao,
                valor
            )
            VALUES (
                $id_parametro,
                $descricao,
                $valor
            )
        `);

        try {
            for await (const param of paramList) {
                await statement.executeAsync({
                    $id_parametro: param.id_parametro,
                    $descricao: param.descricao,
                    $valor: param.valor,
                });
            }
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    return { getParam, updateParamList };
}

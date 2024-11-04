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

    async function updateParam(id_parametro: number, dataInicio: string, valor: number) {
        const [day, month, year] = dataInicio.split('/');
        const v_data_inicio = new Date(`${year}-${month}-${day}`).toISOString();

        const statementUpdateParam = await database.prepareAsync(`
            UPDATE parametro
            SET valor = $valor
            WHERE id_parametro = $id_parametro
        `);

        const statementUpdateProducao = await database.prepareAsync(`
            UPDATE producao
            SET historico_preco_unidade = 
            (
                ($valor * 
                (SELECT pr.tempo_minuto FROM produto pr WHERE pr.id_produto = producao.id_produto)) +
                (SELECT pr.preco FROM produto pr WHERE pr.id_produto = producao.id_produto)
            )
            WHERE producao.id_dia IN (
                SELECT d.id_dia
                FROM dia d
                WHERE d.data_dia_producao >= $data_inicio
            )
        `);

        try {
            await statementUpdateParam.executeAsync({
                $valor: valor,
                $id_parametro: id_parametro,
            });

            await statementUpdateProducao.executeAsync({
                $valor: valor / 60,
                $data_inicio: v_data_inicio,
            });

            return { status: 200, message: "Atualização bem-sucedida" };
        } catch (error) {
            throw error;
        } finally {
            await statementUpdateParam.finalizeAsync();
            await statementUpdateProducao.finalizeAsync();
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

    return { getParam, updateParam, updateParamList };
}

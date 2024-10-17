
import { useSQLiteContext } from "expo-sqlite";
import { DayType } from "../types/types";

export default function useDayDatabase() {

    const database = useSQLiteContext()

    async function getDay(id_pessoa?: number) {
        try {
            const result = id_pessoa
                ? `SELECT * FROM dia WHERE id_pessoa = $id_pessoa ORDER BY data_dia_producao DESC`
                : `SELECT * FROM dia ORDER BY data_dia_producao DESC`;

            const response = id_pessoa
                ? await database.getAllAsync<DayType>(result, { $id_pessoa: id_pessoa })
                : await database.getAllAsync<DayType>(result);

            return response;
        } catch (error) {
            throw error;
        }
    }

    async function postDay(id_pessoa: number, data_dia_producao: string, valor_dia: number) {
        const statement = await database.prepareAsync(`
            INSERT INTO dia (
                id_pessoa,
                data_dia_producao,
                valor_dia
            )
            VALUES (
                $id_pessoa,
                $data_dia_producao,
                $valor_dia
            )
        `);

        try {
            const result = await statement.executeAsync({
                $id_pessoa: id_pessoa,
                $data_dia_producao: data_dia_producao,
                $valor_dia: valor_dia
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
                pessoa,
                data_dia_producao,
                valor_dia
            )
            VALUES (
                $id_dia,
                $id_pessoa,
                $pessoa,
                $data_dia_producao,
                $valor_dia
            )
        `);

        try {
            for await (const dia of diaList) {
                await statementInsert.executeAsync({
                    $id_dia: dia.id_dia || null,
                    $id_pessoa: dia.id_pessoa,
                    $pessoa: dia.pessoa,
                    $data_dia_producao: dia.data_dia_producao,
                    $valor_dia: dia.valor_dia
                });
            }
        } catch (error) {
            throw error;
        } finally {
            await statementInsert.finalizeAsync();
        }
    }

    return { getDay, updateDiaList, postDay }
}
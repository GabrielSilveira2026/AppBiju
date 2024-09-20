import { useSQLiteContext } from "expo-sqlite";
import * as SQLite from 'expo-sqlite/legacy';

export type PendingOperationType = {
    id_operacoes_pendentes: number,
    metodo: "POST" | "PUT" | "DELETE",
    url: string,
    body?: string
    header?: string,
    sincronizado?: boolean
};

export default function usePendingOperationDatabase() {
    const database = useSQLiteContext();

    async function postPendingOperation(operacao: Omit<PendingOperationType, "id_operacoes_pendentes">) {
        const statement = await database.prepareAsync(`
            INSERT INTO operacoes_pendentes (
                metodo,
                url,
                body,
                header,
                sincronizado
            )
            VALUES (
                $metodo,
                $url,
                $body,
                $header,
                $sincronizado
            )
        `);
        try {
            const result = await statement.executeAsync({
                $metodo: operacao.metodo,
                $url: operacao.url,
                $body: operacao?.body || null,
                $header: operacao?.header || null,
                $sincronizado: false
            });

            return result.lastInsertRowId;
        } catch (error) {
            console.error("Erro ao inserir operação pendente:", error);
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function getPendingOperation() {
        try {
            const result = "SELECT * FROM operacoes_pendentes"

            const response = await database.getAllAsync<PendingOperationType>(result)

            return response
        } catch (error) {
            throw error
        }
    }

    async function getPendingOperationNotSinc() {
        try {
            const result = "SELECT * FROM operacoes_pendentes WHERE sincronizado = 0"

            const response = await database.getAllAsync<PendingOperationType>(result)

            return response
        } catch (error) {
            throw error
        }
    }

    async function brandSincPendingOperation(idOperacao: number) {
        const statement = await database.prepareAsync(`
            UPDATE operacoes_pendentes
            SET sincronizado = 1
            WHERE id_operacoes_pendentes = $idOperacao
        `)

        try {
            const result = await statement.executeAsync({
                $idOperacao: idOperacao
            });
            return result
        } catch (error) {
            throw error;
        }
    }
    return { postPendingOperation, getPendingOperation, getPendingOperationNotSinc, brandSincPendingOperation };
}

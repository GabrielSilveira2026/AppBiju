import { useSQLiteContext } from "expo-sqlite";
import { PaymentType } from "../types/types";

export default function usePaymentDatabase() {
    const database = useSQLiteContext();

    async function getPayment(id_pessoa?: number) {
        try {
            const query = id_pessoa
                ? `
                    SELECT pagamento.*, pessoa.nome 
                    FROM pagamento
                    INNER JOIN pessoa ON pagamento.id_pessoa = pessoa.id_pessoa
                    WHERE pagamento.id_pessoa = $id_pessoa
                    ORDER BY pagamento.data_pagamento DESC
                  `
                : `
                    SELECT pagamento.*, pessoa.nome 
                    FROM pagamento
                    INNER JOIN pessoa ON pagamento.id_pessoa = pessoa.id_pessoa
                    ORDER BY pagamento.data_pagamento DESC
                  `;

            const response = id_pessoa
                ? await database.getAllAsync<PaymentType>(query, { $id_pessoa: id_pessoa })
                : await database.getAllAsync<PaymentType>(query);

            return response;
        } catch (error) {
            throw error;
        }
    }

    async function postPayment(payment: PaymentType) {
        const statement = await database.prepareAsync(`
            INSERT INTO pagamento (
                id_pagamento,
                data_pagamento,
                id_pessoa,
                valor_pagamento
            )
            VALUES (
                $id_pagamento,
                $data_pagamento,
                $id_pessoa,
                $valor_pagamento
            )
        `);
        try {
            const result = await statement.executeAsync({
                $id_pagamento: payment.id_pagamento,
                $data_pagamento: payment.data_pagamento,
                $id_pessoa: payment.id_pessoa,
                $valor_pagamento: payment.valor_pagamento
            });
            return result.lastInsertRowId;
        } catch (error) {
            console.warn("Erro ao inserir pagamento:", error);
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function updatePaymentList(paymentList: PaymentType[], id_pessoa?: number) {
        const statementDelete = id_pessoa
            ? await database.prepareAsync(`DELETE FROM pagamento WHERE id_pessoa = $id_pessoa`)
            : await database.prepareAsync(`DELETE FROM pagamento`);

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
            INSERT INTO pagamento (
                id_pagamento,
                data_pagamento,
                id_pessoa,
                valor_pagamento
            )
            VALUES (
                $id_pagamento,
                $data_pagamento,
                $id_pessoa,
                $valor_pagamento
            )
        `);

        try {
            for await (const payment of paymentList) {
                await statementInsert.executeAsync({
                    $id_pagamento: payment.id_pagamento,
                    $data_pagamento: payment.data_pagamento,
                    $id_pessoa: payment.id_pessoa,
                    $valor_pagamento: payment.valor_pagamento
                });
            }
        } catch (error) {
            throw error;
        } finally {
            await statementInsert.finalizeAsync();
        }
    }

    async function deletePayment(id_pagamento: string) {
        const statement = await database.prepareAsync(`
            DELETE FROM pagamento 
            WHERE id_pagamento = $id_pagamento
        `);
    
        try {
            const result = await statement.executeAsync({
                $id_pagamento: id_pagamento
            });
    
            return result.changes > 0;
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }
    
    return { postPayment, getPayment, deletePayment, updatePaymentList };
}


import { useSQLiteContext } from "expo-sqlite";
import { DayType, PaymentType } from "../types/types";

export default function usePendingPayment() {

    const database = useSQLiteContext()

    async function getPendingPayment(id_pessoa?: number) {
        try {
            const result = id_pessoa
                ? `SELECT * FROM pagamento_pendente WHERE id_pessoa = $id_pessoa`
                : `SELECT * FROM pagamento_pendente`;

            // Prepara a execução da query com ou sem o id_pessoa
            const response = id_pessoa
                ? await database.getAllAsync<PaymentType>(result, { $id_pessoa: id_pessoa })
                : await database.getAllAsync<PaymentType>(result);

            return response;
        } catch (error) {
            throw error;
        }
    }


    async function updatePendingPaymentList(paymentList: PaymentType[], id_pessoa?: number) {

        const statementDelete = id_pessoa
            ? await database.prepareAsync(`DELETE FROM pagamento_pendente WHERE id_pessoa = $id_pessoa`)
            : await database.prepareAsync(`DELETE FROM pagamento_pendente`);

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

        const statement = await database.prepareAsync(`
            INSERT INTO pagamento_pendente (
                id_pessoa, 
                nome, 
                ultimo_pagamento, 
                total
            )
            VALUES (
                $id_pessoa, 
                $nome, 
                $ultimo_pagamento, 
                $total
            )
        `);

        try {
            for await (const payment of paymentList) {
                await statement.executeAsync({
                    $id_pessoa: payment.id_pessoa,
                    $nome: payment.nome,
                    $ultimo_pagamento: payment.ultimo_pagamento,
                    $total: payment.total,
                });
            }
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }


    return { getPendingPayment, updatePendingPaymentList }
}
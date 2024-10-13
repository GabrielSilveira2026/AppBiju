
import { useSQLiteContext } from "expo-sqlite";
import { DayType, PendingPaymentType } from "../types/types";

export default function usePendingPaymentDatabase() {

    const database = useSQLiteContext()

    async function getPendingPayment(id_pessoa?: number) {
        try {
            const result = id_pessoa
                ? `SELECT 
                    P.id_pessoa,
                    P.nome AS Nome,
                    PG.Ultimo_Pagamento,
                    COALESCE(SUM(
                        CASE 
                            WHEN strftime('%m-%Y', D.data_dia_producao) = strftime('%m-%Y', PG.Ultimo_Pagamento)
                            THEN PR.quantidade * PR.historico_preco_unidade
                            ELSE 0
                        END
                    ), 0) AS total
                FROM 
                    pessoa P
                LEFT JOIN 
                    (SELECT id_pessoa, MAX(data_pagamento) AS Ultimo_Pagamento
                    FROM pagamento
                    GROUP BY id_pessoa) PG
                    ON P.id_pessoa = PG.id_pessoa
                LEFT JOIN 
                    dia D ON P.id_pessoa = D.id_pessoa
                LEFT JOIN 
                    producao PR ON D.id_dia = PR.id_dia
                WHERE 
                    P.id_pessoa = $id_pessoa
                GROUP BY 
                    P.id_pessoa, P.nome, PG.Ultimo_Pagamento`
                : `SELECT 
                    P.id_pessoa,
                    P.nome AS Nome,
                    PG.Ultimo_Pagamento,
                    COALESCE(SUM(
                        CASE 
                            WHEN strftime('%m-%Y', D.data_dia_producao) = strftime('%m-%Y', PG.Ultimo_Pagamento)
                            THEN PR.quantidade * PR.historico_preco_unidade
                            ELSE 0
                        END
                    ), 0) AS total
                FROM 
                    pessoa P
                LEFT JOIN 
                    (SELECT id_pessoa, MAX(data_pagamento) AS Ultimo_Pagamento
                    FROM pagamento
                    GROUP BY id_pessoa) PG
                    ON P.id_pessoa = PG.id_pessoa
                LEFT JOIN 
                    dia D ON P.id_pessoa = D.id_pessoa
                LEFT JOIN 
                    producao PR ON D.id_dia = PR.id_dia
                GROUP BY 
                    P.id_pessoa, P.nome, PG.Ultimo_Pagamento`;
    
            // Criação do objeto de parâmetros
            const params: { $id_pessoa?: number } = {};
            if (id_pessoa !== undefined) {
                params.$id_pessoa = id_pessoa;
            }
    
            const response = await database.getAllAsync<PendingPaymentType>(result, params.$id_pessoa !== undefined ? params : {});
    
            return response;
        } catch (error) {
            throw error;
        }
    }
    


    async function updatePendingPaymentList(paymentList: PendingPaymentType[], id_pessoa?: number) {

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
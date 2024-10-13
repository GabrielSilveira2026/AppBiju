
import { useSQLiteContext } from "expo-sqlite";
import { ParamType, ProductType } from "../types/types";

export default function useProductDatabase() {

    const database = useSQLiteContext()

    async function postProduct(data: Omit<ProductType, "id_produto">) {
        const statement = await database.prepareAsync(`
            INSERT INTO produto (
            cod_referencia, 
            nome, 
            descricao, 
            preco, 
            tempo_minuto, 
            data_modificado, 
            modificado_por, 
            ultimo_valor
            )
            VALUES (
            $cod_referencia, 
            $nome, 
            $descricao, 
            $preco, 
            $tempo_minuto, 
            $data_modificado, 
            $modificado_por, $ultimo_valor
            )
        `)
        try {
            const result = await statement.executeAsync({
                $cod_referencia: data.cod_referencia,
                $nome: data.nome,
                $descricao: data.descricao,
                $preco: data.preco,
                $tempo_minuto: data.tempo_minuto,
                $data_modificado: data.data_modificado,
                $modificado_por: data.modificado_por,
                $ultimo_valor: data.ultimo_valor
            })

            const insertedRowId = result.lastInsertRowId.toLocaleString()

            const response = await database.getAllAsync<ProductType>(`SELECT * FROM produto WHERE rowid = ${insertedRowId}`)

            return response

        } catch (error) {
            throw error
        } finally {
            await statement.finalizeAsync()
        }
    }

    async function updateProductList(productList: ProductType[]) {
        const statement = await database.prepareAsync(`
            INSERT INTO produto (
            cod_referencia, 
            nome, 
            descricao, 
            preco, 
            tempo_minuto, 
            data_modificado, 
            modificado_por, 
            ultimo_valor
            )
            VALUES (
            $cod_referencia, 
            $nome, 
            $descricao, 
            $preco, 
            $tempo_minuto, 
            $data_modificado, 
            $modificado_por, $ultimo_valor
            )
        `)

        const statementDelete = await database.prepareAsync(`DELETE FROM produto`)
        try {
            await statementDelete.executeAsync()
        } catch (error) {
            throw error
        } finally {
            await statementDelete.finalizeAsync()
        }

        try {
            for await (const product of productList) {
                await statement.executeAsync({
                    $cod_referencia: product.cod_referencia,
                    $nome: product.nome,
                    $descricao: product.descricao,
                    $preco: product.preco,
                    $tempo_minuto: product.tempo_minuto,
                    $data_modificado: product.data_modificado,
                    $modificado_por: product.modificado_por,
                    $ultimo_valor: product.ultimo_valor
                })
            }

        } catch (error) {
            throw error
        } finally {
            await statement.finalizeAsync()
        }
    }

    async function getProduct() {
        try {
            const result = "SELECT * FROM produto ORDER BY nome ASC"

            const response = await database.getAllAsync<ProductType>(result)

            return response
        } catch (error) {
            throw error
        }
    }

    async function updateProduct(v_id_produto: number, productData: ProductType, dataInicio: string) {
        const [day, month, year] = dataInicio.split('/');
        const v_data_inicio = new Date(`${year}-${month}-${day}`).toISOString();

        const statementUpdateProduct = await database.prepareAsync(`
        UPDATE produto
        SET 
            cod_referencia = $cod_referencia,
            nome = $nome,
            descricao = $descricao,
            preco = $preco,
            tempo_minuto = $tempo_minuto,
            data_modificado = datetime('now'),
            modificado_por = $modificado_por,
            ultimo_valor = $ultimo_valor
        WHERE id_produto = $id_produto
    `);

        const statementUpdateProducao = await database.prepareAsync(`
        UPDATE producao
        SET historico_preco_unidade = 
        (
            $valor_hora / 60 * $tempo_minuto + $preco
        )
        WHERE id_dia IN (
            SELECT id_dia
            FROM dia
            WHERE data_dia_producao >= $data_inicio
        )
        AND id_produto = $id_produto
    `);

        try {
            await statementUpdateProduct.executeAsync({
                $cod_referencia: productData.cod_referencia,
                $nome: productData.nome,
                $descricao: productData.descricao,
                $preco: productData.preco,
                $tempo_minuto: productData.tempo_minuto,
                $modificado_por: productData.modificado_por,
                $ultimo_valor: productData.ultimo_valor,
                $id_produto: v_id_produto
            });

            const valorHoraResult = `SELECT valor FROM parametro WHERE id_parametro = 1`
            const valorHoraDB = await database.getAllAsync<ParamType>(valorHoraResult)
            const valorHora = valorHoraDB[0] ? valorHoraDB[0].valor : 0;

            await statementUpdateProducao.executeAsync({
                $valor_hora: valorHora,
                $tempo_minuto: productData.tempo_minuto,
                $preco: productData.preco,
                $data_inicio: v_data_inicio,
                $id_produto: v_id_produto
            });

            const result = `SELECT * FROM produto WHERE id_produto = ${v_id_produto}`

            const response = await database.getAllAsync<ProductType>(result)

            return response
        } catch (error) {
            throw error;
        } finally {
            await statementUpdateProduct.finalizeAsync();
            await statementUpdateProducao.finalizeAsync();
        }
    }


    return { postProduct, getProduct, updateProduct, updateProductList }
}
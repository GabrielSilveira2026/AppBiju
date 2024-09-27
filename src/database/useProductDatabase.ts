
import { useSQLiteContext } from "expo-sqlite";
import { ProductType } from "../types/types";

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

    return { postProduct, getProduct, updateProductList }
}
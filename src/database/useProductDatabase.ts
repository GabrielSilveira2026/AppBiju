
import { useSQLiteContext } from "expo-sqlite";
import { ParamType, ProductType } from "../types/types";

export default function useProductDatabase() {

    const database = useSQLiteContext()

    async function getProduct(id_produto?: string) {
        try {
            const result = id_produto
                ? `SELECT 
                       p.id_produto, 
                       p.cod_referencia, 
                       p.nome, 
                       p.descricao,
                       p.preco, 
                       p.tempo_minuto, 
                       p.data_modificado, 
                       p.modificado_por, 
                       p.ultimo_valor,
                       (IFNULL(par.valor, 0) / 60 * p.tempo_minuto + p.preco) AS valor_unidade
                   FROM 
                       produto p
                   LEFT JOIN 
                       parametro par 
                       ON par.id_parametro = 1
                   WHERE 
                       p.id_produto = ?
                   ORDER BY 
                       p.nome ASC`
                : `SELECT 
                       p.id_produto, 
                       p.cod_referencia, 
                       p.nome, 
                       p.descricao,
                       p.preco, 
                       p.tempo_minuto, 
                       p.data_modificado, 
                       p.modificado_por, 
                       p.ultimo_valor,
                       (IFNULL(par.valor, 0) / 60 * p.tempo_minuto + p.preco) AS valor_unidade
                   FROM 
                       produto p
                   LEFT JOIN 
                       parametro par 
                       ON par.id_parametro = 1
                   ORDER BY 
                       p.nome ASC`;

            const response = id_produto
                ? await database.getAllAsync<ProductType>(result, [id_produto])
                : await database.getAllAsync<ProductType>(result);

            return response;
        } catch (error) {
            throw error;
        }
    }

    async function postProduct(product: ProductType) {
        const statement = await database.prepareAsync(`
            INSERT INTO produto (
            id_produto,
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
            $id_produto,
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
                $id_produto: product.id_produto,
                $cod_referencia: product.cod_referencia,
                $nome: product.nome,
                $descricao: product.descricao,
                $preco: product.preco,
                $tempo_minuto: product.tempo_minuto,
                $data_modificado: product.data_modificado,
                $modificado_por: product.modificado_por,
                $ultimo_valor: product.ultimo_valor
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

    async function updateProduct(productData: ProductType, dataInicio: string) {
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
                    WHERE id_produto  = $id_produto
                `);

        const statementUpdateProducao = await database.prepareAsync(`
                UPDATE producao
                SET historico_preco_unidade = 
                $preco_unidade
                WHERE id_dia IN (
                    SELECT id_dia
                    FROM dia
                    WHERE data_dia_producao >= $data_inicio
                )
                AND id_produto = $id_produto
            `);

        try {
            await statementUpdateProduct.executeAsync({
                $id_produto: productData.id_produto,
                $cod_referencia: productData.cod_referencia,
                $nome: productData.nome,
                $descricao: productData.descricao,
                $preco: productData.preco,
                $tempo_minuto: productData.tempo_minuto,
                $modificado_por: productData.modificado_por,
                $ultimo_valor: productData.ultimo_valor
            });

            const valorHoraResult = `SELECT valor FROM parametro WHERE id_parametro = 1`
            const valorHoraDB = await database.getAllAsync<ParamType>(valorHoraResult)
            const valorHora = valorHoraDB[0] ? valorHoraDB[0].valor : 0;

            const preco_unidade = Number((valorHora / 60) * productData.tempo_minuto) + Number(productData.preco);

            await statementUpdateProducao.executeAsync({
                $valor_hora: valorHora,
                $tempo_minuto: productData.tempo_minuto,
                $preco: productData.preco,
                $data_inicio: v_data_inicio,
                $id_produto: productData.id_produto,
                $preco_unidade: preco_unidade
            });

            const response = await getProduct(productData.id_produto)

            return response[0]

        } catch (error) {
            throw error;
        } finally {
            await statementUpdateProduct.finalizeAsync();
            await statementUpdateProducao.finalizeAsync();
        }
    }

    async function updateProductList(productList: ProductType[]) {
        const statement = await database.prepareAsync(`
            INSERT INTO produto (
                id_produto,
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
                $id_produto,
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
                    $id_produto: product.id_produto || null,
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

    return { postProduct, getProduct, updateProduct, updateProductList }
}
export type UserType = {
    email: string;
    id_perfil: number;
    id_pessoa: number;
    nome: string;
    perfil: string;
    senha?: string
};

export type ProductType ={
    id_produto: number;
    cod_referencia: number;
    nome: string;
    descricao: string;
    preco: number;
    tempo_minuto: number;
    data_modificado: string | null;
    modificado_por: string | null;
    ultimo_valor: number | null;
}
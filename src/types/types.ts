export type UserType = {
    email: string;
    id_perfil: number;
    id_pessoa: number;
    nome: string;
    perfil: string;
    senha?: string,
};

export type ProductType = {
    id_produto: string;
    cod_referencia: number;
    nome: string;
    descricao: string;
    preco: number;
    tempo_minuto: number;
    data_modificado: string | null;
    modificado_por: number | null;
    ultimo_valor: number | null;
    valor_unidade?: number
}

export type DayType = {
    id_dia: string;
    data_dia_producao: string;
    id_pessoa: number;
    pessoa?: string;
    valor_dia?: number;
};

export type PendingPaymentType = {
    id_pessoa: number;
    nome: string;
    ultimo_pagamento: string;
    total: number;
};

export type PaymentType = {
    id_pagamento: string;
    data_pagamento: string;
    nome: string;
    id_pessoa: number;
    valor_pagamento: number;
};

export interface ProductionType {
    id_producao: string;
    id_dia: string;
    id_produto: string;
    tempo_minuto: number,
    nome_produto: string;
    quantidade: number;
    observacao: string;
    historico_preco_unidade: number;
}

export type ParamType = {
    id_parametro_local: number;
    id_parametro: number;
    descricao: string;
    valor: number;
};

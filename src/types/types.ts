export type UserType = {
    email: string;
    id_perfil: number;
    id_pessoa: number;
    nome: string;
    perfil: string;
    senha?: string,
};

export type ProductType = {
    id_produto_local: number,
    id_produto?: number;
    cod_referencia: number | string;
    nome: string;
    descricao: string;
    preco: number;
    tempo_minuto: number;
    data_modificado: string | null;
    modificado_por: number | null;
    ultimo_valor: number | null
}

export type DayType = {
    id_dia_local: number;
    id_dia?: number;
    data_dia_producao: string;
    id_pessoa: number;
    pessoa: string;
    valor_dia: number;
};

export type PendingPaymentType = {
    id_pessoa: number;
    nome: string;
    ultimo_pagamento: string;
    total: number;
};

export type PaymentType = {
    id_pagamento_local: number;
    id_pagamento?: number;
    data_pagamento: string;
    id_pessoa: number;
    valor_pagamento: number;
};

export interface ProductionType {
    id_producao_local: number;
    id_producao?: number;
    id_dia: number;
    id_produto: number;
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

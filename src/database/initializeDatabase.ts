import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS dia (
            id_dia_local INTEGER PRIMARY KEY AUTOINCREMENT,
            id_dia INTEGER,
            id_pessoa INTEGER NOT NULL,
            pessoa VARCHAR(100) NOT NULL,
            data_dia_producao DATE NOT NULL,
            valor_dia DECIMAL(38, 18) NOT NULL,
            CONSTRAINT fk_pessoa FOREIGN KEY (id_pessoa) REFERENCES pessoa(id_pessoa)
        );
    `);

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS operacoes_pendentes(
            id_operacoes_pendentes INTEGER PRIMARY KEY AUTOINCREMENT,
            metodo TEXT NOT NULL,
            url TEXT NOT NULL,
            body TEXT,
            header TEXT,
            sincronizado BOOLEAN DEFAULT FALSE
        );
    `);

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS parametro (
            id_parametro INTEGER NOT NULL,
            descricao TEXT NOT NULL,
            valor REAL NOT NULL
        );
    `);

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS pagamento (
            id_pagamento_local INTEGER PRIMARY KEY AUTOINCREMENT,
            id_pagamento INTEGER,
            data_pagamento TEXT,
            id_pessoa INTEGER NOT NULL,
            valor_pagamento REAL,
            CONSTRAINT fk_pessoa_pagamento FOREIGN KEY (id_pessoa) REFERENCES pessoa(id_pessoa)
        );
    `);

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS pagamento_pendente (
            id_pagamento_local INTEGER PRIMARY KEY AUTOINCREMENT,
            id_pagamento INTEGER,
            id_pessoa INTEGER NOT NULL,
            nome TEXT NOT NULL,
            ultimo_pagamento TEXT,
            total REAL NOT NULL
        );
    `);

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS perfil (
            id_perfil_local INTEGER PRIMARY KEY AUTOINCREMENT,
            id_perfil INTEGER,
            perfil TEXT NOT NULL
        );
    `);

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS pessoa (
            id_pessoa_local INTEGER PRIMARY KEY AUTOINCREMENT,
            id_pessoa INTEGER,
            nome TEXT NOT NULL,
            email TEXT NOT NULL,
            id_perfil INTEGER,
            CONSTRAINT fk_perfil FOREIGN KEY (id_perfil) REFERENCES perfil(id_perfil)
        );
    `);

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS producao (
            id_producao_local INTEGER PRIMARY KEY AUTOINCREMENT,
            id_producao INTEGER,
            id_dia INTEGER NOT NULL,
            id_produto INTEGER NOT NULL,
            quantidade REAL NOT NULL,
            observacao TEXT NOT NULL,
            historico_preco_unidade REAL NOT NULL,
            CONSTRAINT fk_dia FOREIGN KEY (id_dia) REFERENCES dia(id_dia),
            CONSTRAINT fk_producao FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
        );
    `);

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS produto (
            id_produto_local INTEGER PRIMARY KEY AUTOINCREMENT,
            id_produto INTEGER,
            cod_referencia INTEGER NOT NULL,
            nome TEXT NOT NULL,
            descricao TEXT,
            preco REAL NOT NULL,
            tempo_minuto INTEGER NOT NULL,
            data_modificado TEXT,
            modificado_por TEXT,
            ultimo_valor REAL
        ); 
    `);
}

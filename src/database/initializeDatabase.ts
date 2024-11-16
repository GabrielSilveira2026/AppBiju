import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS dia (
            id_dia TEXT NOT NULL,
            id_pessoa TEXT NOT NULL,
            data_dia_producao DATE NOT NULL,
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
            id_pagamento TEXT NOT NULL,
            data_pagamento TEXT,
            id_pessoa INTEGER NOT NULL,
            valor_pagamento REAL,
            CONSTRAINT fk_pessoa_pagamento FOREIGN KEY (id_pessoa) REFERENCES pessoa(id_pessoa)
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
            id_pessoa INTEGER,
            nome TEXT NOT NULL,
            email TEXT NOT NULL,
            id_perfil INTEGER,
            CONSTRAINT fk_perfil FOREIGN KEY (id_perfil) REFERENCES perfil(id_perfil)
        );
    `);

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS producao (
            id_producao TEXT NOT NULL,
            id_dia TEXT NOT NULL,
            id_produto TEXT NOT NULL,
            quantidade REAL NOT NULL,
            observacao TEXT,
            historico_preco_unidade REAL NOT NULL,
            CONSTRAINT fk_dia FOREIGN KEY (id_dia) REFERENCES dia(id_dia),
            CONSTRAINT fk_producao FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
        );
    `);

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS produto (
            id_produto TEXT NOT NULL,
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

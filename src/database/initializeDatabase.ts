import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS produto (
            id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
            cod_referencia INTEGER NOT NULL,
            nome TEXT NOT NULL,
            descricao TEXT NOT NULL,
            preco REAL NOT NULL,
            tempo_minuto INTEGER NOT NULL,
            data_modificado TEXT,
            modificado_por TEXT,
            ultimo_valor REAL
        ); 
    `)

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS operacoes_pendentes(
            id_operacoes_pendentes INTEGER PRIMARY KEY AUTOINCREMENT,
            metodo TEXT NOT NULL,
            url TEXT NOT NULL,
            body TEXT,
            header TEXT,
            sincronizado BOOLEAN DEFAULT FALSE
        );
    `)  

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS dia (
            id_dia INTEGER PRIMARY KEY AUTOINCREMENT,
            id_pessoa INTEGER NOT NULL,
            data_dia_producao DATE,
            CONSTRAINT fk_pessoa FOREIGN KEY (id_pessoa) REFERENCES pessoa(id_pessoa)
        );
    `);
    

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS pagamento_pendente (
            id_pagamento INTEGER PRIMARY KEY AUTOINCREMENT,
            id_pessoa INTEGER NOT NULL,
            nome TEXT NOT NULL,
            ultimo_pagamento TEXT NOT NULL,
            total REAL NOT NULL
        );
    `);
}

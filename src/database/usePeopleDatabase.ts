import { useSQLiteContext } from "expo-sqlite";
import { UserType } from "../types/types";

export default function usePeopleDatabase() {
    const database = useSQLiteContext();

    async function postPeople(user: UserType) {
        const statement = await database.prepareAsync(`
            INSERT INTO pessoa (
                id_pessoa,
                nome,
                email,
                id_perfil
            )
            VALUES (
                $id_pessoa,
                $nome,
                $email,
                $id_perfil
            )
        `);
    
        try {
            await statement.executeAsync({
                $id_pessoa: user.id_pessoa || '', 
                $nome: user.nome || '',
                $email: user.email || '',
                $id_perfil: user.id_perfil !== undefined ? user.id_perfil : null,
            });
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }
    

    async function getPeople(id_pessoa?: number) {
        try {
            const result = id_pessoa
                ? `SELECT * FROM pessoa WHERE id_pessoa = $id_pessoa ORDER BY nome`
                : `SELECT * FROM pessoa ORDER BY nome`;

            const response = id_pessoa
                ? await database.getAllAsync<UserType>(result, { $id_pessoa: id_pessoa })
                : await database.getAllAsync<UserType>(result);

            return response;
        } catch (error) {
            throw error;
        }
    }

    async function updateUser(user: UserType) {
        const statement = await database.prepareAsync(`
            UPDATE pessoa
            SET 
                nome = $nome,
                email = $email,
                senha = $senha,
                id_perfil = $id_perfil
            WHERE id_pessoa = $id_pessoa
        `);

        try {
            await statement.executeAsync({
                $nome: user.nome,
                $email: user.email,
                $senha: user.senha || "",
                $id_perfil: user.id_perfil,
                $id_pessoa: user.id_pessoa,
            });
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function updatePeopleList(peopleList: UserType[]) {
        const statementDelete = await database.prepareAsync(`DELETE FROM pessoa`);

        try {
            await statementDelete.executeAsync();
        } catch (error) {
            throw error;
        } finally {
            await statementDelete.finalizeAsync();
        }

        const statement = await database.prepareAsync(`
            INSERT INTO pessoa (
                id_pessoa,
                nome,
                email,
                id_perfil
            )
            VALUES (
                $id_pessoa,
                $nome,
                $email,
                $id_perfil
            )
        `);

        try {
            for await (const person of peopleList) {
                await statement.executeAsync({
                    $id_pessoa: person.id_pessoa || '', 
                    $nome: person.nome || '',
                    $email: person.email || '',
                    $id_perfil: person.id_perfil !== undefined ? person.id_perfil : null,
                });
            }
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }
    
    return { getPeople, updatePeopleList, updateUser, postPeople };
}

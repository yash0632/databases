import { closeConnection,connectDatabase,client } from "./database.js";

async function testDatabase(){
    await connectDatabase();
    
    try{
        
    } catch(err){
        console.error("Error creating users table:", err);
    } finally {
        await closeConnection();
    }
}


//testDatabase();
async function createUsersTable(){
    await connectDatabase();
    
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL 
        );
    `;

    try{
        await client.query(query);
        console.log("Users table created successfully.");
        await insertUser("John Doe","'); DROP TABLE users;--");
    } catch(err){
        console.error("Error creating users table:", err);
    } finally {
        await closeConnection();
    }
}



createUsersTable();


async function insertUser(name:string,email:string){
    const query = `
        INSERT INTO users(name,email)
        VALUES ($1,$2);
    `
    await client.query(query,[name,email]);
}



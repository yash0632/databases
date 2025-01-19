import pkg from 'pg';

import * as dotenv from 'dotenv';
dotenv.config();

const {Client}=pkg;
export const client = new Client({
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
});

export async function connectDatabase(){
    try{
        await client.connect();
        console.log('Connected to PostgreSQL database');
    }
    catch(err){
        console.error(`Error connecting to PostgreSQL database:`,err);
        process.exit(1);
    }
}


export async function closeConnection(){
    try{
        await client.end();
        console.log('Connection to PostgreSQL closed');
    }
    catch(err){
        console.error('Error closing connection to PostgreSQL', err);
    }
}

process.on('SIGINT',async()=>{
    await closeConnection();
    process.exit(0);
})
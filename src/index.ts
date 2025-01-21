import { closeConnection,connectDatabase,client } from "./database.js";
import {faker} from '@faker-js/faker'
import path from "path";
import {v4 as uuid} from 'uuid'
import fs from 'fs';

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
    
    // const query = `
    //     CREATE TABLE IF NOT EXISTS users (
    //         id SERIAL PRIMARY KEY,
    //         name VARCHAR(100) NOT NULL,
    //         email VARCHAR(100) UNIQUE NOT NULL 
    //     );
    // `;

    try{
        //await client.query(query);
        // console.log("Users table created successfully.");
        // await insertUser("John Doe","'); DROP TABLE users;--");
        //await loadFakeData();
        //await alterTable();
        await insertManyUsers();
    } catch(err){
        console.error("Error creating users table:", err);
    } finally {
        console.log("code here")
        await closeConnection();
    }
}



createUsersTable();

async function insertManyUsers(){
    await new Promise<void>((resolve,reject)=>{
        const filePath = path.join(process.cwd(),'scripts','users.csv');
        const readStream = fs.createReadStream(filePath,'utf-8');
        let pendingInserts = 0;
        let streamEnded = false;
        console.time("Execution time");

        readStream.on('data',async(chunk:string)=>{
            
            readStream.pause();
            async function readData(chunk:string){   
                const lines = chunk.split('\n');
                pendingInserts += lines.length;
                for(const line of lines){
                    
                    const [name,email,jobtitle] = line.split(",");
                    
                    await insertUser(name,email,jobtitle); 
                    pendingInserts--;
                    if(streamEnded && pendingInserts <= 0){
                        console.timeEnd("Execution Time");
                        console.log("all data is inserted successfully");
                        resolve();
                    }
                }
            }
            await readData(chunk);
            readStream.resume();
        })
        
        
        readStream.on('end',()=>{
            console.log("All data read, waiting for inserts...");
            streamEnded = true;
            
        })

        readStream.on("error",(err)=>{
            reject(err);
        })
    })   
}


async function insertUser(name:string,email:string,jobtitle:string){
    
    const query = `
        INSERT INTO users(name,email,jobtitle)
        VALUES ($1,$2,$3);
    `
    await client.query(query,[name,email,jobtitle]);
}

async function loadFakeData(){
    const filePath = path.join(process.cwd(),'scripts','users.csv').replace(/\\/g,'/')
    const query = `
        COPY users(name, email,jobtitle)
        FROM '${filePath}'
        DELIMITER ',';
    `;
    console.time("Execution time");
    await client.query(query);
    console.timeEnd("Execution time");
}


async function alterTable(){
    const query = `
        ALTER TABLE users
        ADD COLUMN email VARCHAR(100),
        ADD COLUMN jobtitle VARCHAR(100);
    `

    await client.query(query);
}


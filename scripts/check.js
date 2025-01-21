import fs from "fs";

async function checkAsync(){
    const readStream = fs.createReadStream('./scripts/users.csv','utf-8');
    let inserts = 0;

    readStream.on('data',async(chunk)=>{
        const lines = chunk.split('\n');
        for(const line of lines){ 
            
            console.log("done")
            await new Promise((resolve)=>setTimeout(()=>resolve(),1000));
            console.log("doneend")
        }
    });
    readStream.on('end',()=>{
        
        console.log("all data is inserted successfully");
    });
}

checkAsync();
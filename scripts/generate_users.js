import {faker} from '@faker-js/faker';
import fs from 'fs'
import path from 'path';
import {v4 as uuid} from 'uuid';

let total_num = 1_000_000;
const filePath = path.join(process.cwd(),'scripts','users.csv');
const writeStream = fs.createWriteStream(filePath);

writeStream.write(`name,email\n`);

for(let i = 0;i < total_num;i++){
    const randomName = faker.person.fullName();
    let randomEmail = faker.internet.email({firstName:faker.person.firstName(),lastName:faker.person.lastName()});
    let randomEmailArray = randomEmail.split("@");
    //console.log(randomEmailArray);
    randomEmailArray.splice(1,0,uuid({offset:10}).toString(),"@");
    randomEmail = randomEmailArray.join("");
    //console.log(randomEmail);
    

    writeStream.write(`${randomName},${randomEmail}\n`);

}

writeStream.end(()=>{
    console.log(`CSV file users.sv generated successfully!`);
})
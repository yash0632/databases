import { closeConnection,connectDatabase,client } from "./database.js";
import {faker} from '@faker-js/faker'
import path from "path";
import {v4 as uuid} from 'uuid'
import fs from 'fs';
import { connect } from "http2";

async function applyQuery(){
    try{
        await connectDatabase();
        await insertStudentsQuery("yash");
        await insertStudentsQuery("yogender");
        await insertStudentsQuery("karamvir");
        await insertStudentsQuery("yash");
        await insertCoursesQuery("CN","harkesh","CSE");
        await insertCoursesQuery("TPvv","kamaldeep","ECE");
        await insertCoursesQuery("MT","harkesh","CSE");
        
    }
    catch(err){
        console.error(err);
    }
    finally{
        closeConnection();
    }

}

applyQuery();



async function insertStudentsQuery(studentname:string){
    const query = `
        INSERT INTO student(studentname)
        VALUES($1);
    `
    await client.query(query,[studentname])
}

async function insertCoursesQuery(courseName:string,teacherName:string,department:string){
    const query = `
        INSERT INTO course(teachername,department,coursename)
        VALUES($1,$2,$3);
    `
    await client.query(query,[teacherName,department,courseName]);
}

async function insertStudentCourseQuery(
    studentId:number,
    courseName:string
){
    const query = `
        INSERT INTO studentcourse(studentid,coursename)
        VALUES($1,$2);
    `
    await client.query(query,[studentId,courseName])
}

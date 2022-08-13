import fs from "fs";
import fetch from "node-fetch";
import { exit } from "process";


for (const name of ['aws', 'data', 'draw', 'excel', 'js', 'python', 'web']){

    const fl = fs.readFileSync(`./${name}.json`, 'utf-8');
    const jf = JSON.parse(fl);
    
    async function get_price(id){
        const url = `https://www.udemy.com/api-2.0/pricing/?course_ids=${id}&fields[pricing_result]=price`;
        const res = await fetch(url);
        const res_json = await res.json();
        return res_json.courses[id].price.amount;
    }
    
    async function go(){
    
        const res = {
            "title" : jf.unit.title,
            "courses" : await Promise.all(jf.unit.items.map(async course => ({
                "id": course.id,
                "title": course.title,
                "headline": course.headline,
                "rating": course.avg_rating,
                "image": course.image_750x422,
                "instructors": course.visible_instructors.map(instructor => ({
                    "name": instructor.display_name,
                    "jop": instructor.job_title,
                    "image": instructor.image_100x100,
                })),
                "price": await get_price(course.id),
            }))),
        };
        
        fs.writeFileSync(`${name}_res.json`, JSON.stringify(res));
    }
    
    go();
}
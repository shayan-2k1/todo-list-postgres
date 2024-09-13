import { NextRequest, NextResponse } from 'next/server';
import pool from "@/app/utils/db";
import { join } from 'path';
import { writeFile } from 'fs/promises';


export async function GET() {
    try 
    {
        const client = await pool.connect();
        const res = await client.query("SELECT * FROM tasks");
        const todos = res.rows;
        client.release();
        return NextResponse.json(todos);
    } 
    catch (error) 
    {
        console.error("Error fetching todos:", error);
        return NextResponse.error();
    }
}
  
  export async function POST(request: NextRequest) {
    try 
    {

        const data = await request.formData();
        const id: String | null = data.get("id") as unknown as String;
        const heading: String | null= data.get("heading") as unknown as String;
        const subheading: String | null = data.get("subheading") as unknown as String;
        const footer: String | null = data.get("footer") as unknown as String;
        const image: File | null = data.get("image") as unknown as File;

        const bytes=await image.arrayBuffer();
        const buffer=Buffer.from(bytes);

        const path=join(process.cwd(),"public","images",image.name);
        await writeFile(path, buffer);

        let img=`/images/${image.name}`;

        const client = await pool.connect();
        const res = await client.query(
        "INSERT INTO tasks (id, heading, subheading, footer, image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [id, heading, subheading, footer, img]
        );
        console.log("end",request.formData());
        client.release();
        return NextResponse.json(res.rows[0], { status: 201 });
    }   
    catch (error) 
    {
        console.error("Error adding todo:", error);
        return NextResponse.error();
    }
}

export async function PUT(request: NextRequest) {
    try 
    {
        const { id, heading, subheading, footer } = await request.json();
        const client = await pool.connect();
        const res = await client.query(
        "UPDATE tasks SET heading = $1, subheading=$2, footer=$3 WHERE id = $4 RETURNING *",
        [heading, subheading, footer, id]
        );
        client.release();
        if (res.rows.length === 0) {
        return NextResponse.json({ message: "Todo not found" }, { status: 404 });
        }
        return NextResponse.json(res.rows[0]);
    } 
    catch (error) 
    {
        console.error("Error updating todo:", error);
        return NextResponse.error();
    }
}

export async function DELETE(request: NextRequest) {
    try 
    {
        const { id} = await request.json();
        const client = await pool.connect();

        if (!id) {
        return NextResponse.json({ message: "Missing id" }, { status: 400 });
        }
        const res = await client.query("DELETE FROM tasks WHERE id = $1", [id]);
        client.release();

        if (res.rowCount === 0) {
            return NextResponse.json({ message: "Todo not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Todo deleted successfully" });
    } 
    catch (error) 
    {
        console.error("Error deleting todo:", error);
        return NextResponse.error();
    }
}


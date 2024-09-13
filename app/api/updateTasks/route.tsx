import { NextRequest, NextResponse } from 'next/server';
import pool from "@/app/utils/db";

export async function POST(request: NextRequest) {
    const client = await pool.connect();
    const { task } = await request.json();

    try {
        console.log('Received tasks:', task);

        for (let index = 0; index < task.length; index++) {
            const taskId = task[index].id.trim();
            const newPosition = index + 1;

            const res = await client.query(
                'UPDATE tasks SET "order" = $1 WHERE id = $2',
                [newPosition, taskId]
            );

            if (res.rowCount !== 1) {
                console.warn('Task with id ${taskId} not found or not updated');
            }
        }

        const updatedTasks = await client.query('SELECT * FROM tasks ORDER BY "order"');
        client.release();

        console.log('Updated Tasks:', updatedTasks.rows);

        return NextResponse.json(updatedTasks.rows);
    } catch (err) {

        console.error('Error updating positions:', err);
        client.release();
        throw err; 
    }
}
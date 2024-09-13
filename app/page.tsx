import AddTask from "./components/AddTask";
import TodoList from "./components/TodoList";
import { ITask } from "@/types/tasks";
import axios from 'axios';

export default async function Home() {
  const response = await axios.get('http://localhost:3000/api/todos');
  const tasks=JSON.stringify(response.data);
  return (
    <main className='max-w-4xl mx-auto mt-4'>
      <div className='text-center my-5 flex flex-col gap-4'>
        <h1 className='text-2xl font-bold'>Todo List App</h1>
        <AddTask />
      </div>
      <TodoList tasks={JSON.parse(tasks) as ITask[]} />
    </main>
  );
}

'use client';
import { ITask } from "@/types/tasks";
import React, { use, useState } from "react";
import Task from "./Task";
import { RiDragMove2Fill } from "react-icons/ri";
import { BiCollapseVertical } from "react-icons/bi";

interface TodoListProps {
  tasks: ITask[];
}

const TodoList: React.FC<TodoListProps> = ({ tasks }) => {
  
  const [dragButton, setDragButton] = React.useState<boolean>(false);
  const [currentTasks, setCurrentTasks]= React.useState<ITask[]>(tasks);
  const [draggingIndex, setDraggingIndex] = useState(null);


  const handleDrag = () => {

    setDragButton((dragButton)=>!dragButton);
  }

  const updateTasksOrder = async (updatedTask) => {
    try 
    {
      const updatedTasks = updatedTask.map((task, index) => ({
        ...task,
        position: index + 1,
    }));

      console.log('Updated Tasks:', updatedTasks);
      const response = await fetch('http://localhost:3000/api/updateTasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: updatedTasks }),
      });
      if (response.ok) {
        console.log('Tasks updated successfully');
      } else {
        console.error('Failed to update tasks');
      }
    } catch (error) {
      console.error('Error updating tasks:', error);
    }
  };



  const handleDrop=async (draggedTaskId: string, droppedTaskId: string)=> {
    const newTasks=[...currentTasks];
    const draggedTaskIndex=newTasks.findIndex(task=>task.id===draggedTaskId);
    const targetTaskIndex=newTasks.findIndex(task=>task.id===droppedTaskId);
  
    const [draggedTask]=newTasks.splice(draggedTaskIndex,1);
  
    newTasks.splice(targetTaskIndex,0,draggedTask);
  
    setCurrentTasks(newTasks);
    updateTasksOrder(newTasks);

    setDraggingIndex(null);

  };
  
  return (
    <div className='overflow-x-auto'>
      <div className="flex gap-[2%]">
        <button className='btn btn-accent w-full' onClick={handleDrag}>
          <RiDragMove2Fill               
            cursor='pointer'
            className='text-black-500'
            size={25}
            />
        </button>
        </div>
      <table className='table w-full'>
        {/* head */}
        <thead>
          <tr>
  
            <th>Tasks</th>
            <th>Image</th>
            <th>Actions</th>
  
          </tr>
        </thead>
        <tbody>
          {tasks.map((task,index) => (
            <Task key={task.id} task={task} dragButton={dragButton} onDrop={handleDrop} onUpdate={setCurrentTasks}/>
          ))}
        </tbody>
      </table>
    </div>
  );
  };

export default TodoList;

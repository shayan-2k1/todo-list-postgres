"use client";

import { ITask } from "@/types/tasks";
import { FormEventHandler, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import axios from "axios";
import { MdOutlineDragIndicator } from "react-icons/md";
import Image from "next/image";

interface TaskProps {
  task: ITask;
  dragButton: boolean;
  onDrop: (draggedTaskId: string, targetTaskId: string) => void
}

const Task: React.FC<TaskProps> = ({ task, dragButton, onDrop }) => {
  const router = useRouter();
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<string>(task.heading);
  const [subTaskToEdit, setSubTaskToEdit] = useState<string>(task.subheading);
  const [descriptionToEdit, setDescriptionToEdit] = useState<string>(task.footer);

  const handleSubmitEditTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const update=await fetch('http://localhost:3000/api/todos', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: task.id,
        heading: taskToEdit,
        subheading: subTaskToEdit,
        footer: descriptionToEdit,
      }),
    });
    if(update.ok){
      setOpenModalEdit(false);
      router.refresh();
    }
  };



  const handleDeleteTask = async (id: string) => {
    const del =await axios.delete("http://localhost:3000/api/todos", { data: { id } });
    if(del.status === 200)
    {
      setOpenModalDeleted(false);
      router.refresh();
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
  };

  const handleDragOver = (e: React.DragEvent) => {  
    e.preventDefault();
  }

  const handleDrop = (e: React.DragEvent) => {  
    e.preventDefault();
    const draggedTaskId = e.dataTransfer.getData('text/plain');
    onDrop(draggedTaskId, task.id);
  }

  if(!dragButton)
  {
    return(
      <tr key={task.id}>
        <td >
          <h1 className="text-2xl">{task.heading}</h1>
          <h2>{task.subheading}</h2>
          <p>{task.footer}</p>
        </td>
        <td className="w-full">
          <Image
            src={task.image}
            alt='random image'
            width={256}
            height={256}
          />
        </td>
        <td className="flex gap-5">
          <FiEdit
            onClick={() => setOpenModalEdit(true)}
            cursor='pointer'
            className='text-blue-500'
            size={25}
          />
          <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
            <form onSubmit={handleSubmitEditTodo}>
              <h3 className='font-bold text-lg'>Edit task</h3>
              <div className='modal-action flex-col'>
                <div>
                  <label className='label ml-2'>
                    Heading
                  </label>
                  <input
                    value={taskToEdit}
                    onChange={(e) => setTaskToEdit(e.target.value)}
                    type='text'
                    placeholder='Enter heading'
                    className='input input-bordered w-[98%] ml-2'
                    />
                </div>
                <div>
                  <label className='label'>
                    Sub-Heading
                  </label>
                  <input
                    value={subTaskToEdit}
                    onChange={(e) => setSubTaskToEdit(e.target.value)}
                    type='text'
                    placeholder='Enter sub-details'
                    className='input input-bordered w-full'
                  />
                </div>
                  <div>
                    <label className='label'>
                      Description
                    </label>
                    <input
                      value={descriptionToEdit}
                      onChange={(e) => setDescriptionToEdit(e.target.value)}
                      type='text'
                      placeholder='Enter description'
                      className='input input-bordered w-full'
                    />
                  </div>
                  <div> 
                    <button type='submit' className='btn mt-2'>
                      Submit 
                    </button>
                  </div>
                </div>
              </form>
            </Modal>
            <FiTrash2
              onClick={() => setOpenModalDeleted(true)}
              cursor='pointer'
              className='text-red-500'
              size={25}
            />
            <Modal modalOpen={openModalDeleted} setModalOpen={setOpenModalDeleted}>
              <h3 className='text-lg'>
                Are you sure, you want to delete this task?
              </h3>
              <div className='modal-action'>
                <button onClick={() => handleDeleteTask(task.id)} className='btn'>
                  Yes
                </button>
              </div>
            </Modal>
          </td>
        </tr>
      );
    }
    else if(dragButton)
    {
      return(
        <tr 
          key={task.id}
          draggable={dragButton}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <td className='flex w-full gap-5'>
            <MdOutlineDragIndicator 
              cursor='pointer'
              className='text-blue-500'
              size={25}
            />
            {task.heading}
          </td>
          <td className="w-full">
            <Image
              src={task.image}
              alt='random image'
              width={32}
              height={32}
            />
          </td> 
        </tr>
      );
    }
};

export default Task;

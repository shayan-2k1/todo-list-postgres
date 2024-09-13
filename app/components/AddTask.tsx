"use client";

import { AiOutlinePlus } from "react-icons/ai";
import Modal from "./Modal";
import { FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const AddTask = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newTaskValue, setNewTaskValue] = useState<string>("");
  const [newSubTaskValue, setNewSubTaskValue] = useState<string>("");
  const [newDescriptionValue, setNewDescriptionValue] = useState<string>("");
  const [file,setFile]=useState<File>();

  

  const handleSubmitNewTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if(!file){
      return;
    }
    const formData = new FormData();
    formData.append("id",uuidv4());
    formData.append("heading",newTaskValue);
    formData.append("subheading",newSubTaskValue);
    formData.append("footer",newDescriptionValue);
    if (file) {
      formData.append("image", file);
    }
    const add=await fetch('http://localhost:3000/api/todos', {
      method: 'POST',
      body: formData
    });
    if(add.ok)
    {
      setNewTaskValue("");
      setFile(undefined);
      setNewSubTaskValue("");
      setNewDescriptionValue("");
      setModalOpen(false);
      router.refresh();
    }
  };

  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className='btn btn-primary w-full'
      >
        Add new task <AiOutlinePlus className='ml-2' size={18} />
      </button>

      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <form onSubmit={handleSubmitNewTodo}>
          <h3 className='font-bold text-lg'>Add new task</h3>
          <div className='modal-action flex-col'>
            <div>
              <label className='label ml-2'>
                Heading
              </label>
              <input
                value={newTaskValue}
                onChange={(e) => setNewTaskValue(e.target.value)}
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
                value={newSubTaskValue}
                onChange={(e) => setNewSubTaskValue(e.target.value)}
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
                value={newDescriptionValue}
                onChange={(e) => setNewDescriptionValue(e.target.value)}
                type='text'
                placeholder='Enter description'
                className='input input-bordered w-full'
              />
            </div>
            <div>
            <label className='label'>
                Image File
              </label>
              <input
                onChange={(e) => setFile(e.target.files?.[0])}
                type='file'
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
    </div>
  );
};

export default AddTask;

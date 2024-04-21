import { useEffect, useState, useRef, FormEvent } from "react"
import { FiTrash } from "react-icons/fi"
import { FaEdit } from "react-icons/fa"
import { api } from "./services/api"
import moment from "moment"

interface TaskProps{
  id: string;
  taskName: string;
  dueDate: string;
  priority: string;
  status: boolean;
  created_at: string;
}

export default function App() {

  const [tasks, setTasks] = useState<TaskProps[]>([])
  const nameTaskRef = useRef<HTMLInputElement | null>(null)
  const dueDateRef = useRef<HTMLInputElement | null>(null)
  const priorityRef = useRef<HTMLSelectElement | null>(null)



  useEffect(()=> {
    loadTasks()
  }, [])

  async function loadTasks(){
    const response = await api.get("/tasks")
    setTasks(response.data)
  }

  async function handleSubmit(event: FormEvent){
    event.preventDefault();
    const dueDate = moment(dueDateRef.current?.value).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    const response = await api.post("/task",{
      taskName: nameTaskRef.current?.value,
      dueDate: dueDate,
      priority: priorityRef.current?.value
    })

    setTasks(allTasks => [...allTasks, response.data])
    console.log(response.data)
  }

  return (
    <div className="w-full min-h-screen bg-blue-950 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-white">Tasks</h1>
        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label className="font-medium text-white">Name of Task:</label>
          <input className="w-full mb-5 p-2 rounded" type="text" ref={nameTaskRef} placeholder="Type the name of task" />

          <div className="grid grid-cols-2 gap-x-2 mb-5">
            <div>
              <label className="font-medium text-white">Due date</label>
              <div>
                <input className="w-full p-2 rounded h-10" type="date" ref={dueDateRef} placeholder="Type the name of task" />
              </div>
            </div>
           
            <div>
              <label className="font-medium text-white">Priority</label>
              <div>
                <select className="w-full rounded p-2 h-10" ref={priorityRef}>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>
          <input 
            type="submit" 
            value="Submit" 
            className="cursor-pointer w-full p-2 bg-purple-700 rounded text-white font-bold" 
          />
        </form>

        <section className="flex flex-col">
          {tasks.map((task)=>(
            <article 
            key={task.id}
            className="w-full bg-white rounded p-2 mb-5 relative hover:scale-105 duration-200">
            <p><span className="font-medium">Task:</span> {task.taskName}</p>
            <p><span className="font-medium">Due date:</span> {moment(task.dueDate).format('DD/MM/YY')}</p>
            <p><span className="font-medium">Priority:</span> {task.priority}</p>

            <div className="flex absolute gap-1 -right-2 -top-2">
              <button className="bg-blue-500 w-7 h-7 flex items-center justify-center rounded-lg ">
                <FaEdit  size={18} color="#fff"/>
              </button>
              <button className="bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg">
                <FiTrash size={18} color="#fff"/>
              </button>
            </div>
          </article>
          ))}
        </section>
      </main>
    </div>
  )
}
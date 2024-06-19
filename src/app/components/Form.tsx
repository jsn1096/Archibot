'use client'

import { useState } from "react"

const Form = () => {

  const [soft, setSoft] = useState("")
  const [topic, setTopic] = useState("")
  const [result, setResult] = useState("")
  const [cargando, setCargando] = useState<boolean>(false)

  const getData = async () => {
    const data = await fetch(`http://localhost:3000/api?search=${topic.replace(" ", "+")}+en+${soft}`)
    return data.json()
  }

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
if (soft === "" || topic === "") {
  alert('llena todos los campos') 
} else {
  e.preventDefault()
  setResult("")
  setCargando(true)
  getData().then(r => {
    setResult(r.data)
    setSoft("")
    setTopic("")
  }).catch(e => {
    alert("Algo pasó, no pudimos hacer la petición")
  }).finally(() => {
    setCargando(false) //para no poner el setCargando tanto en el then como en el catch
  })
}
}

  return (
    <>    
      <div className="form-section max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className=" flex flex-col gap-y-5">

          <select required disabled={cargando} onChange={(e) => setSoft(e.target.value)} name="software" id="software" className="cursor-pointer bg-[#1b263b] text-gray-200 rounded-lg p-1">
            <option value="">Seleccione un programa</option>
            <option value="Archicad">Archicad</option>
            <option value="Autocad">AutoCAD</option>
            <option value="Sketchup">SketchUp</option>
          </select>

          <textarea disabled={cargando} required onChange={(e) => setTopic(e.target.value)} className=" bg-[#1b263b] py-2 px-3 rounded-lg" name="topic" id="topic" cols={30} rows={4}></textarea>
          <input type="submit" disabled={cargando} value={`${cargando ? "Cargando..." : "Enviar"}`} className=" active:bg-white active:text-black py-2 border border-white rounded-lg cursor-pointer" />
        </form>
      </div>

      <div className="result-section">
        <h2>Resultado</h2>
        {
          result !== "" &&
          <p className="text-white">{result}</p>
        }
      </div>
    </>
  )
}

export default Form
import { useEffect, useState } from "react"

export const Checklist = () => {
  //checklist will do the fetching and return the laoding state
  // by default its a GET
  //USE EFFECT
  //if no second argument, will run only once, if second argument, will rerun everytime data changes
  //see docs
  //data is data, setData is a function to set the data
  const [data, setData] = useState<{ item_name: string }[] | []>([])
  //check docs

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:4002/checklist/")
      const data = await response.json()
      setData(data)
    }
    fetchData()
  }, [])

  return (
    <ul>
      {!data.length ? <h1>Loading</h1> : data.map((item) => {
        return <li>{item.item_name}</li>
      })}
    </ul>)
} 
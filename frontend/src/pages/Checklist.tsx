import React from "react";

function BackButton() {
  return <td><button>{"<-"}</button></td>
}

function CheckedButton() {
  //will add onClick, run the function 
  return <td><input type="checkbox"></input></td>
}

function ChecklistHeader() {
  return (
    <table>
      <tbody>
        <tr>
          <BackButton />
          <td>Checklist</td>
        </tr>
        <tr>
          <td colSpan={2}>Create a Checklist so you don't miss a thing!</td>
        </tr>
      </tbody>
    </table>
  )
}

function AddItemButton() {
  return <button>+ Add Item</button>
}

function ChecklistTable() {
  const items = [
    { id: 1, item_name: "Dishwashing tabs", quantity: 10, purchased: false, category_id: 3, user_id: 1 },
    { id: 2, item_name: "Water bottle", quantity: 13, purchased: false, category_id: 3, user_id: 1 },
    { id: 3, item_name: "Ipad", quantity: 1, purchased: false, category_id: 3, user_id: 1 },
    { id: 4, item_name: "Deloitte", quantity: 3, purchased: false, category_id: 3, user_id: 1 },
    { id: 5, item_name: "Detergent", quantity: 30, purchased: false, category_id: 3, user_id: 1 }]
  //get an array of checklist items from backend
  //map to a product row 

  const tableItems = items.map((item) => {
    return (
      <tr key={item.id}>
        <td>{item.item_name}</td>
        <td>{item.quantity}</td>
        <td>{item.category_id}</td>
        <CheckedButton />
      </tr>
    )
  })
  return (
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Category</th>
          <th>Checked?</th>
        </tr>
      </thead>
      <tbody>
        {tableItems}
      </tbody>
    </table>
  )
}

export default function Checklist() {
  return (
    <>
      <ChecklistHeader />
      <ChecklistTable />
      <AddItemButton />
    </>
  )
}



// export const Checklist = () => {
//   //checklist will do the fetching and return the laoding state
//   // by default its a GET
//   //USE EFFECT
//   //if no second argument, will run only once, if second argument, will rerun everytime data changes
//   //see docs
//   //data is data, setData is a function to set the data
//   const [data, setData] = useState<{ item_name: string }[] | []>([])
//   //check docs

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await fetch("http://localhost:4002/checklist/")
//       const data = await response.json()
//       setData(data)
//     }
//     fetchData()
//   }, [])

//   return (
//     <ul>
//       {!data.length ? <h1>Loading</h1> : data.map((item) => {
//         return <li>{item.item_name}</li>
//       })}
//     </ul>)
// } 
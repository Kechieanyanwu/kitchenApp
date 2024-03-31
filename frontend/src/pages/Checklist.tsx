import { useState } from 'react';
import AddItemButton from '../components/AddItemButton';
import Form from 'react-bootstrap/Form';
import { ChecklistObject } from '../utils/interfaces';
import TableHeader from '../components/TableHeader';


function CheckedButton(handleCheck: any) {
  //will add onClick, run the function 
  // onCheck, I want it to send to the backend that it has been purchased
  return (
    <td><Form.Check aria-label='option 1' onChange={handleCheck} /></td>
  )
}


function ChecklistTable() { //on first render, do I get this passed as a prop? 

  //will run function to get checklist items, then will set the state
  const checklistItems: Array<ChecklistObject> = [
    { id: 1, item_name: "Dishwashing tabs", quantity: 10, purchased: false, category_id: 3, user_id: 1 },
    { id: 2, item_name: "Water bottle", quantity: 13, purchased: false, category_id: 3, user_id: 1 },
    { id: 3, item_name: "Ipad", quantity: 1, purchased: false, category_id: 3, user_id: 1 },
    { id: 4, item_name: "Deloitte", quantity: 3, purchased: false, category_id: 3, user_id: 1 },
    { id: 5, item_name: "Detergent", quantity: 30, purchased: false, category_id: 3, user_id: 1 }]

  const [items, setItems] = useState(checklistItems)

  const checkItem = () => {
    //checks off an item in the backend
    // then will call setItems with the updated checklist 
    // do I want to just send to the backend, and just remove the item from the array on the frontend? 
    // like just delete it from the array, instead of waiting for data from the backend 
  }

  const tableItems = items.map((item) => {
    return (
      <tr className="checklist-item" key={item.id}>
        <td>{item.item_name}</td>
        <td>{item.quantity}</td>
        <td>{item.category_id}</td>
        <CheckedButton handleCheck={checkItem} />
        {/* could either do checkItem or just pass a setter */}
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
      {/* <ChecklistHeader /> */}
      <TableHeader title={"Checklist"} subtitle={"Create a Checklist so you don't miss a thing!"} />
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
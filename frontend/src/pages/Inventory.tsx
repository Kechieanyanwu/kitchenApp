import AddItemButton from '../components/AddItemButton';
import { InventoryObject } from '../utils/interfaces';
import TableHeader from '../components/TableHeader';


function InventoryTable() { //on first render, do I get this passed as a prop? 

    //will run function to get checklist items, then will set the state
    const inventoryItems: Array<InventoryObject> = [
        { id: 1, item_name: "Dishwashing tabs", quantity: 10, category_id: 3, user_id: 1 },
        { id: 2, item_name: "Water bottle", quantity: 13, category_id: 3, user_id: 1 },
        { id: 3, item_name: "Ipad", quantity: 1, category_id: 3, user_id: 1 },
        { id: 4, item_name: "Deloitte", quantity: 3, category_id: 3, user_id: 1 },
        { id: 5, item_name: "Detergent", quantity: 30, category_id: 3, user_id: 1 }]


    const tableItems = inventoryItems.map((item) => {
        return (
            <tr className="inventory-item" key={item.id}>
                <td>{item.item_name}</td>
                <td>{item.quantity}</td>
                <td>{item.category_id}</td>
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
                </tr>
            </thead>
            <tbody>
                {tableItems}
            </tbody>
        </table>
    )
}

export default function Inventory() {
    return (
        <>
            <TableHeader title={"Inventory"} subtitle={"Manage your Inventory!"} />
            <InventoryTable />
            <AddItemButton />
        </>
    )
}

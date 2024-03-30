import HomeHeader from "../components/HomeHeader";
import Col from 'react-bootstrap/Col';
import { ItemCardProps } from "../utils/interfaces";
function ItemCard({ itemName, subtitle, itemNumber }: ItemCardProps) {
    return (
        <>
            <h1>Checklist</h1>
        </>
    )
}

function Home() {
    return (
        <div>
            <HomeHeader />
        </div>
    )
}


export default Home;
import HomeHeader from "../components/HomeHeader";
import Button from 'react-bootstrap/button';
import { CardGroup } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import { ItemCardProps } from "../utils/interfaces";
import NavBar from "../components/NavBar";
function ItemCard({ itemName, subtitle, itemNumber }: ItemCardProps) {
    return (
        <Card style={{ width: '18rem' }} className="mb-2">
            <Card.Body>
                <Row>
                    <Card.Title>{itemName}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{subtitle}</Card.Subtitle>
                    <Button variant="secondary">+</Button>
                    <Card.Text> Number of Items </Card.Text>
                    <p>{itemNumber}</p>
                </Row>
            </Card.Body>
        </Card>
    )
}

function CardColumn() {
    return (
        <>
            <Row>
                <ItemCard itemName="Checklist" subtitle="Add items so you don't forget anything!" itemNumber={0} />
            </Row>
            <Row>
                <ItemCard itemName="Inventory" subtitle="Keep track of everything you have!" itemNumber={0} />
            </Row>
        </>
    )
}

function Home() {
    return (
        <>
            <HomeHeader />
            <CardColumn />
            <NavBar />
        </>
    )
}


export default Home;
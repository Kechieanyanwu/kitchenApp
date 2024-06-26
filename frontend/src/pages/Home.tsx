import HomeHeader from "../components/HomeHeader";
import Button from 'react-bootstrap/button';
import { CardGroup } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import { ItemCardProps } from "../utils/interfaces";
import NavBar from "../components/NavBar";
function ItemCard({ itemName, subtitle, itemNumber }: ItemCardProps) {
    return (
        <Card className="home-card">
            <Card.Body>
                <Row>
                    <div className="card-row">
                        <div>
                            <Card.Title>{itemName}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{subtitle}</Card.Subtitle>
                            <Card.Text> Number of Items </Card.Text>
                            <p className="card-number">{itemNumber}</p>
                        </div>
                        <div className="card-button dark">
                            <Button variant="secondary">+</Button>
                        </div>
                    </div>
                </Row>
            </Card.Body>
        </Card>
    )
}

function CardColumn() {
    return (
        <>
            {/* Props can be further extended to add text and background colour, and button actions */}
            {/* For adding customisable styling, you can choose to use predefined classes or allow individual values to be passed */}
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
            <div className="footer-buttons">
                <NavBar />
            </div>
        </>
    )
}


export default Home;
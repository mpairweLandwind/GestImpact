
import './PropertyCard.css';
import { useNavigate } from "react-router-dom";
import { truncate } from 'lodash';
import Heart from "../Heart/Heart";

const PropertyCard = ({ card }) => {
  const navigate = useNavigate();

  return (
    <div className="flexColStart r-card" onClick={() => navigate(`../properties/${card.id}`)}>
      <Heart id={card.id} />
      <img src={card.image[0]} alt="property" />
      <span className="secondaryText r-price">
        <span style={{ color: "orange" }}>$</span>
        <span>{card.regularPrice || card.maintenanceCharge}</span>
      </span>
      <span className="primaryText">{truncate(card.name, { length: 20 })}</span>
      <span className="secondaryText">{truncate(card.description, { length: 80 })}</span>
    </div>
  );
};

export default PropertyCard;

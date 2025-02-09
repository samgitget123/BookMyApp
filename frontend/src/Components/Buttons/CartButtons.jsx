import { FaShoppingCart } from "react-icons/fa";

const CartButtons = ({ onClick , count=[] }) => {
  return (
    <button 
      onClick={onClick} 
      className="cart-button"
    >
      <FaShoppingCart className="cart-icon"  />
      {count.length > 0 && <span className="cart-badge text-white">{count.length}</span>}
    </button>
  );
};

export default CartButtons;

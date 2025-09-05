import React, { useEffect, useState } from "react";
import { useCart } from "../pages/CartContext";
import { itemsPageStyles } from './../assets/dummyStyles';
import { FiArrowLeft, FiMinus, FiPlus } from "react-icons/fi"
import { Link, useLocation, useNavigate } from 'react-router-dom';

//product cart
const ProductCart = ({ item }) => {
    const { cart, addToCart, removeFromCart, updateQuantity } = useCart();

    // get current quantity
    const cartItem = cart.find(cartItem => cartItem.id === item.id)
    const quantity = cartItem ? cartItem.quantity : 0;

    // add to cart 
    const handleAddToCart = () => {
        addToCart(item);
    }


    //handle Increament 
    const handleIncrement = () => {
        if (quantity === 0) {
            addToCart(item)
        }
        else {
            updateQuantity(item.id, quantity + 1)
        }
    }

    // handle decrement 
    const handleDeCrement = () => {
        if (quantity === 1) {
            removeFromCart(item.id)
        }
        else if (quantity > 1) {
            updateQuantity(item.id, quantity - 1)
        }
    }

    return (
        <div className={itemsPageStyles.productCard}>
            {/* item image  */}
            <div className={itemsPageStyles.imageContainer}>
                <img src={item.image} alt={item.name} className={itemsPageStyles.productImage} />
            </div>
            {/* item description */}
            <div className={itemsPageStyles.cardContent}>
                <div className={itemsPageStyles.titleContainer}>
                    <h3 className={itemsPageStyles.titleContainer}>{item.name}</h3>
                    <span className={itemsPageStyles.organicTag}> Organic</span>
                </div>
                <p className={itemsPageStyles.productDescription}>
                    {item.description || `Fresh Organic ${item.name.toLowerCase()} sourced locally`}
                </p>
                {/* item price */}
                {/* current price */}
                <div className={itemsPageStyles.priceContainer}>
                    <span className={itemsPageStyles.currentPrice}>
                        ₹{item.price.toFixed(2)}
                    </span>
                    {/* old price */}
                    <span className={itemsPageStyles.oldPrice}>
                        ₹{(item.price * 1.15).toFixed(2)}
                    </span>
                </div>

                <div className="mt-3 ">
                    {
                        quantity > 0 ? (
                            <div className={itemsPageStyles.quantityControls}>
                                <button onClick={handleDeCrement}
                                    className={`${itemsPageStyles.quantityButton} ${itemsPageStyles.quantityButtonLeft}`}>
                                    <FiMinus />
                                </button>
                                <span className={itemsPageStyles.quantityValue}>
                                    {quantity}
                                </span>

                                <button onClick={handleIncrement}
                                    className={`${itemsPageStyles.quantityButton} ${itemsPageStyles.quantityButtonRight}`}>
                                    <FiPlus />
                                </button>

                            </div>
                        ) : (
                            <button onClick={handleAddToCart} className={itemsPageStyles.addButton}>
                                <span>Add To Cart</span>
                                <span className={itemsPageStyles.addButtonArrow}>
                                    →
                                </span>
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    )
};

const Item = () => {

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();
    const [expanedCategories, setExpandedCategories] = useState({});
    const [allexpanded, setAllExpanded] = useState(false);


    // search queary from url 
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        const search = queryParams.get("seach")

        if (search) {
            setSearchTerm(search)
        }
    }, [location])

    // enhance search 
    const itemMatchesSearch = (item, term) => {
        if (!term) return true

        const cleanTerm = term.trim().toLowerCase()
        const searchWords = cleanTerm.spilit()
    }


    // please check if the page 0 exiests
    return <div className={itemsPageStyles.page}>
        <div className={itemsPageStyles.container}>
            <header className={itemsPageStyles.header}>
                <Link to='/' className={itemsPageStyles.backLink}>
                    <FiArrowLeft className="mr-2" />
                    <span>Back</span>
                </Link>

                {/* heading  */}
                <h1 className={itemsPageStyles.mainTitle}>
                    <span className={itemsPageStyles.titleSpan}> Organic</span> Pantry
                </h1>

                <p className={itemsPageStyles.subtitle}>
                    Fresh, premium-quality groceries sourced directly from trusted local organic farms.
                </p>

                <div className={itemsPageStyles.titleDivider}>
                    <div className={itemsPageStyles.dividerLine} />
                </div>

            </header>
        </div>
    </div>;
};

export default Item;

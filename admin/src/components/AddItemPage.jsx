import React, { useRef, useState } from 'react'
import { addItemPageStyles as styles } from '../assets/adminStyle'



const initialFormState = {
    name: '',
    description: '',
    category: '',
    oldPrice: '',
    price: '',
    image: null,
    preview: '',
};
const categories = [
    'Fruits',
    'Vegetables',
    'Dairy & Eggs',
    'Meat & Seafood',
    'Bakery',
    'Pantry',
];


const AddItemPage = () => {

    const [formData, setFormData] = useState(initialFormState)
    const fileInputRef = useRef()

    return (
        <div className={styles.pageContainer}>
            <div className={styles.innerContainer}>
                <h1 className={styles.heading}>Add  New Product</h1>
                {/* form to accept the product data and display on the main websit real time */}
                <form className={styles.form} onSubmit={handleSubmit} >
                    {/* this is for the name of the product */}
                    <div className={styles.gridContainer}>
                        <label className={styles.label}>Product Name *</label>
                        <input type="text" name='name'
                            value={name} onChange={handleChange}
                            required className={styles.input} />
                    </div>
                    {/* this is for the to select the category from the given category */}
                    <div>
                        <label className={styles.label}>Category *</label>
                        <select name="category" value={category}
                            onChange={handleChange} required
                            className={styles.input}>
                            <option value=""> Select Category</option>
                            {categories.map((c) => (
                                <option key={c} value={c}> {c}</option>
                            ))}
                        </select>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default AddItemPage
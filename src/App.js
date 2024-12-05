import React, {useState, useEffect} from 'react'
import './App.css'

const url = 'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'

function App() {
  const [restaurantName, setRestaurantName] = useState('')
  const [tableMenuList, setTableMenuList] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [cart, setCart] = useState({})

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await fetch(url)
        const data = await response.json()
        const {restaurant_name, table_menu_list} = data[0]
        setRestaurantName(restaurant_name)
        setTableMenuList(table_menu_list)

        setSelectedCategory(table_menu_list[0]?.menu_category || '')
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchRestaurantData()
  }, [])

  const handleCategoryClick = category => {
    setSelectedCategory(category)
  }

  const handleItemCountChange = (dishId, change) => {
    setCart(prevCart => {
      const currentCount = prevCart[dishId] || 0
      const updatedCount = Math.max(0, currentCount + change)
      return {...prevCart, [dishId]: updatedCount}
    })
  }

  const totalCartItems = Object.values(cart).reduce(
    (total, count) => total + count,
    0,
  )

  const getCustomizationMessage = category => {
    if (category === 'Fast Food') {
      return 'Customizations available'
    }
    return ''
  }

  const isDishAvailable = dish => {
    return dish.dish_availability !== 'false'
  }

  const getDishQuantityControls = dish => {
    // Check if dish is available or not for the category "Fresh From The Sea"
    if (
      selectedCategory === 'Fresh From The Sea' &&
      dish.dish_availability === 'false'
    ) {
      return null
    }

    return (
      <div className="quantity-controls">
        <button onClick={() => handleItemCountChange(dish.dish_id, -1)}>
          -
        </button>
        <span>
          <p>{cart[dish.dish_id] || 0}</p>
        </span>
        <button onClick={() => handleItemCountChange(dish.dish_id, +1)}>
          +
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="top-bar">
        <h1>{restaurantName}</h1>
        <div className="cart-icon">
          <p>
            My Orders 🛒 <span>{totalCartItems}</span>
          </p>
        </div>
      </div>

      <div className="categories">
        {tableMenuList.map(item => (
          <button
            key={item.menu_category}
            className={`category-button ${
              item.menu_category === selectedCategory ? 'selected' : ''
            }`}
            onClick={() => handleCategoryClick(item.menu_category)}
          >
            {item.menu_category}
          </button>
        ))}
      </div>

      <div className="dishes">
        {selectedCategory &&
          tableMenuList
            .find(item => item.menu_category === selectedCategory)
            ?.category_dishes.map(dish => (
              <div className="dish" key={dish.dish_id}>
                <img
                  src={dish.dish_image}
                  alt={dish.dish_name}
                  className="dish-image"
                />
                <div className="dish-details">
                  <h4>{dish.dish_name}</h4>
                  <p>{dish.dish_description}</p>

                  {/* Uniform price and calorie display for all categories */}
                  <p>
                    <strong>Price:</strong> {dish.dish_currency}{' '}
                    {dish.dish_price}
                  </p>

                  {dish.dish_calories && (
                    <p>
                      <strong>Calories:</strong> {dish.dish_calories} calories
                    </p>
                  )}

                  {dish.addoncat && (
                    <p className="customization">Customizations available</p>
                  )}
                  {selectedCategory === 'Biryani' &&
                    dish.dish_availability === 'false' && <p>Not available</p>}

                  {getDishQuantityControls(dish)}
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}

export default App

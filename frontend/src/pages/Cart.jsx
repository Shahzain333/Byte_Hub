import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { X, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

const Cart = () => {
  const { cart, totalPrice, navigate, axios, fetchCart } = useContext(AppContext);

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 md:h-76 gap-3">
        <ShoppingCart className="w-12 h-12 text-gray-300" />
        <h2 className="text-2xl font-semibold text-gray-700">Your Cart is Empty</h2>
      </div>
    );
  }

  const removeFromCart = async (menuItemId) => {
    try {
      const { data } = await axios.delete(`/api/cart/remove`,{
        data: { menuItemId }
      });
      if (data.success) {
        toast.success(data.message);
        fetchCart();
      }
    } catch (error) {
      console.log("Error in Remove Cart In Frontend",error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4 md:mt-10 bg-white shadow-lg rounded-2xl p-4 md:p-6 mb-8 md:mb-2">

      <h2 className="text-2xl font-semibold mb-6 text-center text-[#FFB703]">Your Cart</h2>

      {/* ── Desktop Table (md and up) ── */}
      <div className="hidden md:block overflow-x-auto">

        <table className="min-w-full border border-gray-200 rounded-lg">
          
          {/* Headings */}
          <thead className="bg-gray-100">
         
            <tr>
              <th className="py-3 px-4 text-left text-gray-700">Item</th>
              <th className="py-3 px-4 text-left text-gray-700">Qty</th>
              <th className="py-3 px-4 text-left text-gray-700">Price</th>
              <th className="py-3 px-4 text-left text-gray-700">Total</th>
              <th className="py-3 px-4 text-center text-gray-700">Action</th>
            </tr>
         
          </thead>
         
         {/* Data of cart */}
          <tbody>
         
            {cart.items.map((item) => (
              
              <tr key={item._id} className="border-t border-gray-200 hover:bg-gray-50">
              
                <td className="py-3 px-4 flex items-center text-left space-x-2">
              
                  <img src={item.menuItem.image} alt={item.menuItem.name} className="w-12 h-12 rounded object-cover"/>
                  <span className="font-medium text-gray-800">{item.menuItem.name}</span>
                
                </td>

                <td className="py-3 px-4 text-left text-gray-700">{item.quantity}</td>
                
                <td className="py-3 px-4 text-left text-gray-700">${item.menuItem.price}</td>
                
                <td className="py-3 px-4 text-left text-gray-700 font-semibold">
                  ${item.menuItem.price * item.quantity}
                </td>
                
                <td className="py-3 px-4 text-center">
                
                  <button onClick={() => removeFromCart(item.menuItem._id)} className="text-gray-500 hover:text-[#FFB703] 
                  transition-colors mx-auto flex" aria-label="Remove item">
                    <X size={20} />
                  </button>

                </td>

              </tr>
              
            ))}
            
          </tbody>
        
        </table>
      
      </div>

      {/* ── Mobile Cards (below md) ── */}
      <div className="flex flex-col gap-3 md:hidden">
        
        {cart.items.map((item) => (
          
          <div key={item._id} className="flex items-center gap-3 border border-gray-200 rounded-xl p-3 
          hover:bg-gray-50 transition">

            {/* Image */}
            <img src={item.menuItem.image} alt={item.menuItem.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0"/>

            {/* Info */}
            <div className="flex-1 min-w-0">
              
              <p className="font-semibold text-gray-800 truncate">{item.menuItem.name}</p>
              
              <p className="text-sm text-gray-500 mt-0.5">
                ${item.menuItem.price} × {item.quantity}
              </p>
              
              <p className="text-sm font-bold text-green-600 mt-0.5">
                ${item.menuItem.price * item.quantity}
              </p>

            </div>

            {/* Remove */}
            <button onClick={() => removeFromCart(item.menuItem._id)} className="text-gray-400 hover:text-[#FFB703]
             transition-colors flex-shrink-0 p-1" aria-label="Remove item">
              <X size={20} />
            </button>
        
          </div>
        
        ))}

      </div>

      {/* ── Footer ── */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-gray-200">
        
        <h3 className="text-xl font-semibold">
          Total: <span className="text-green-600">${totalPrice}</span>
        </h3>

        <button onClick={() => navigate("/checkout")} className="w-full sm:w-auto bg-green-600 text-white px-6 
        py-2 rounded-lg hover:bg-green-700 transition">
          Checkout
        </button>
  
      </div>

    </div>
  
  );
};

export default Cart;
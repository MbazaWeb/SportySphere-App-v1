import React, { useState } from 'react';
import { ShoppingCart, Star, Ticket, Tag } from 'lucide-react';

interface ShopPageProps {
  data: any;
  onAddToCart: (product: any) => void;
  showToast: (message: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  data,
  onAddToCart,
  showToast
}) => {
  const [activeCategory, setActiveCategory] = useState('merchandise');

  const categories = [
    { key: 'merchandise', name: 'Merch', icon: ShoppingCart },
    { key: 'memberships', name: 'VIP', icon: Star },
    { key: 'tickets', name: 'Tickets', icon: Ticket },
    { key: 'promos', name: 'Deals', icon: Tag }
  ];

  const renderProducts = () => {
    const products = data[activeCategory] || [];
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product: any) => (
          <div key={product.id} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-white mb-2">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-gray-400 mb-3">{product.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">
                  ${product.price.toFixed(2)}
                </span>
                <button
                  onClick={() => onAddToCart(product)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-white">Shop</h1>

      {/* Category Tabs */}
      <div className="flex space-x-1 bg-gray-900 rounded-lg p-1">
        {categories.map(({ key, name, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-200
              ${activeCategory === key 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }
            `}
          >
            <Icon size={18} />
            <span className="font-medium">{name}</span>
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {renderProducts()}
    </div>
  );
};
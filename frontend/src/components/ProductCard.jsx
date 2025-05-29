import React from "react";

const ProductCard = ({
  product,
  onOrderClick,
  showOrderButton = true,
  isOrderView = false,
  quantity = null,
}) => {
  return (
    <div className="product-card">
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 flex items-center justify-center mb-4 p-4">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <div className="text-gray-400 text-sm font-medium">noimage</div>
        )}
      </div>

      {/* Product Info */}
      <div className="text-center">
        <h3 className="font-medium text-gray-900 mb-2 uppercase tracking-wide text-sm">
          {product.name}
        </h3>

        <p className="text-gray-600 text-xs mb-3 line-height-relaxed">
          {product.description}
        </p>

        {/* Quantity for order view */}
        {isOrderView && quantity && (
          <div className="text-sm text-gray-600 mb-2">Quantity: {quantity}</div>
        )}

        {/* Price */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="font-bold text-lg">${product.price}</span>
        </div>

        {/* Stock Status and Order Button */}
        {showOrderButton && (
          <>
            {product.stock === 0 ? (
              <button className="text-red-600 text-sm font-medium mb-2 cursor-not-allowed">
                Out of stock
              </button>
            ) : (
              <button
                onClick={() => onOrderClick && onOrderClick(product)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Order Now
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

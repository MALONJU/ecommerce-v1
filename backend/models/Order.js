const mongoose = require("mongoose");

const orderHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        default: ''
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],

        totalAmount: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },

        history: [orderHistorySchema],

        shippingAddress: {
            address: String,
            city: String,
            postalCode: String,
            country: String
        },

        paymentMethod: {
            type: String,
            default: 'card'
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

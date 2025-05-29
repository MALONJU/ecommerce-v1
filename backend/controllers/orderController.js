const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body;

        // Verify stock availability and update product stock
        // Fetch all products concurrently
        const products = await Promise.all(items.map(item => Product.findById(item.product)));

        // Validate stock availability
        for (let i = 0; i < items.length; i++) {
            const product = products[i];
            if (!product) {
                return res.status(404).json({ 
                    message: `Product not found: ${items[i].product}` 
                });
            }
            if (product.stock < items[i].quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for product: ${product.name}` 
                });
            }
            // Decrease stock
            product.stock -= items[i].quantity;
        }

        // Save all updated products concurrently
        await Promise.all(products.map(product => product.save()));

        const order = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            shippingAddress,
            history: [{
                status: 'pending',
                comment: 'Order created',
                updatedBy: req.user._id
            }]
        });

        // Populate product details
        const populatedOrder = await Order.findById(order._id)
            .populate('user', 'name email')
            .populate('items.product', 'name price imageUrl')
            .populate('history.updatedBy', 'name email');

        res.status(201).json(populatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('items.product', 'name price imageUrl')
            .populate('history.updatedBy', 'name email')
            .sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'name price imageUrl')
            .populate('history.updatedBy', 'name email')
            .sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'name price imageUrl')
            .populate('history.updatedBy', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the user is authorized to view this order
        if (order.user._id.toString() !== req.user._id.toString() && 
            req.user.role !== 'admin') {
            return res.status(401).json({ 
                message: 'Not authorized to view this order' 
            });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status, comment } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Add to history before updating status
        order.history.push({
            status,
            comment: comment || `Status updated to ${status}`,
            updatedBy: req.user._id
        });

        order.status = status;
        const updatedOrder = await order.save();

        // Populate the response
        const populatedOrder = await Order.findById(updatedOrder._id)
            .populate('user', 'name email')
            .populate('items.product', 'name price imageUrl')
            .populate('history.updatedBy', 'name email');

        res.json(populatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Cancel order
// @route   DELETE /api/orders/:id
// @access  Private
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the user is authorized to cancel this order
        if (order.user.toString() !== req.user._id.toString() && 
            req.user.role !== 'admin') {
            return res.status(401).json({ 
                message: 'Not authorized to cancel this order' 
            });
        }

        // Only allow cancellation if order is pending
        if (order.status !== 'pending') {
            return res.status(400).json({ 
                message: 'Order cannot be cancelled in current status' 
            });
        }

        // Add cancellation to history
        order.history.push({
            status: 'cancelled',
            comment: req.body.comment || 'Order cancelled by user',
            updatedBy: req.user._id
        });

        order.status = 'cancelled';
        await order.save();

        // Restore product stock
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order history
// @route   GET /api/orders/:id/history
// @access  Private
const getOrderHistory = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('history.updatedBy', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check authorization
        if (order.user.toString() !== req.user._id.toString() && 
            req.user.role !== 'admin') {
            return res.status(401).json({ 
                message: 'Not authorized to view this order history' 
            });
        }

        res.json(order.history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add history comment
// @route   POST /api/orders/:id/history
// @access  Private/Admin
const addHistoryComment = async (req, res) => {
    try {
        const { comment } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.history.push({
            status: order.status,
            comment,
            updatedBy: req.user._id
        });

        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate('history.updatedBy', 'name email');

        res.json(updatedOrder.history);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getOrderHistory,
    addHistoryComment
}; 
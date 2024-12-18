import Cart from "../../models/cart.model.js";
import { Game } from "../../models/game.model.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await Game.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.totalStock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0 });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    const productsInCart = await Promise.all(
      cart.items.map(async (item) => {
        const productInCart = await Game.findById(item.productId);
        return {
          ...item.toObject(),
          product: productInCart,
        };
      })
    );

    cart.totalAmount = productsInCart.reduce((total, item) => {
      const productPrice =
        item.product.salePrice > 0
          ? item.product.salePrice
          : item.product.price;
      return total + item.quantity * productPrice;
    }, 0);

    await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred",
    });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is manadatory!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "images name price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      images: item.productId.images,
      name: item.productId.name,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present!",
      });
    }

    const existingItem = cart.items[findCurrentProductIndex];
    const product = await Game.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    const productPrice =
      product.salePrice > 0 ? product.salePrice : product.price;

    cart.totalAmount -= existingItem.quantity * productPrice;

    existingItem.quantity = quantity;

    cart.totalAmount += existingItem.quantity * productPrice;

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "images name price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      images: item.productId ? item.productId.images : null,
      name: item.productId ? item.productId.name : "Product not found",
      price: item.productId
        ? item.productId.salePrice > 0
          ? item.productId.salePrice
          : item.productId.price
        : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "images name price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const itemToDelete = cart.items.find(
      (item) => item.productId._id.toString() === productId
    );

    if (!itemToDelete) {
      return res.status(404).json({
        success: false,
        message: "Item not found in the cart!",
      });
    }

    const productPrice =
      itemToDelete.productId.salePrice > 0
        ? itemToDelete.productId.salePrice
        : itemToDelete.productId.price;

    const amountToSubtract = itemToDelete.quantity * productPrice;

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    cart.totalAmount -= amountToSubtract;

    await cart.save();

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      images: item.productId ? item.productId.images : null,
      name: item.productId ? item.productId.name : "Product not found",
      price: item.productId
        ? item.productId.salePrice > 0
          ? item.productId.salePrice
          : item.productId.price
        : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

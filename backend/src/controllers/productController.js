import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Crear un producto
export const createProduct = async (req, res) => {
  const { name, price, description, categoryId, isPromotion } = req.body;

  try {
    // Verificar que la categoría existe
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    const product = new Product({
      name,
      price,
      description,
      isPromotion,
      category: categoryId, // Referencia al _id de la categoría
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};



// Obtener todos los productos
export const getProducts = async (req, res) => {

  try {
    const products = await Product.find().populate('category');
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};


// Editar un producto
export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, stock, category },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json({ message: "Producto actualizado exitosamente", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};


// Obtener productos por categoría
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await Product.find({ category: categoryId }).populate("category");

    if (!products.length) {
      return res.status(404).json({ message: "No se encontraron productos para esta categoría" });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos por categoría" });
  }
};



export const getProductCount = async (req, res) => {
  try {
    // Obtén el conteo total de productos en la colección
    const count = await Product.countDocuments();

    // Envía la respuesta al cliente
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error al obtener la cantidad de productos:", error.message);
    res.status(500).json({ error: "Error al obtener la cantidad de productos" });
  }
};
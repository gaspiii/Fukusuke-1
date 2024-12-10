import Category from '../models/Category.js';

// Crear una nueva categoría
export const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({ error: 'Nombre e imagen son requeridos.' });
    }

    const newCategory = new Category({ name, image });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría.' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
};

export const getTotalCategories = async (req, res) => {
  try {
    const cantidad = await Category.countDocuments(); 
    res.json({ cantidad });
  } catch (error) {
      console.error('Error al obtener cantidad de categorias:', error);
      res.status(500).json({ message: 'Error al obtener cantidad de categorias' });
  }
};
export const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name, image } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, image },
      { new: true }
    );
    if (!categoryId) {
      console.error("Categoría sin ID:", Category);
      return;
    }
    if (!updatedCategory) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    return res.status(200).json({ message: "Categoría actualizada exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar la categoría" });
  }
};


export const deleteCategory = async (req, res) => {
  const { categoryId } = req.params; // Obtener el ID de la categoría desde los parámetros

  try {
    // Intentamos encontrar y eliminar la categoría
    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    return res.status(200).json({ message: "Categoría eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar la categoría" });
  }
};
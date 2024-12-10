import Discount from "../models/Discount.js";

// Crear un descuento
export const createDiscount = async (req, res) => {
  try {
    const { description, percentage, expires } = req.body;

    const newDiscount = new Discount({ description, percentage, expires });
    await newDiscount.save();

    res.status(201).json({ message: "Descuento creado exitosamente", discount: newDiscount });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el descuento" });
  }
};

// Obtener todos los descuentos
export const getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find();
    res.status(200).json(discounts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los descuentos" });
  }
};

// Editar un descuento
export const editDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, percentage, expires } = req.body;

    const updatedDiscount = await Discount.findByIdAndUpdate(
      id,
      { description, percentage, expires },
      { new: true }
    );

    if (!updatedDiscount) {
      return res.status(404).json({ error: "Descuento no encontrado" });
    }

    res.status(200).json({ message: "Descuento actualizado exitosamente", discount: updatedDiscount });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el descuento" });
  }
};

// Eliminar un descuento
export const deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDiscount = await Discount.findByIdAndDelete(id);

    if (!deletedDiscount) {
      return res.status(404).json({ error: "Descuento no encontrado" });
    }

    res.status(200).json({ message: "Descuento eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el descuento" });
  }
};

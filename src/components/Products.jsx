  import React, { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";

  export default function Products() {
    const [categories, setCategories] = useState([]); // Debe ser un array vacío
    const [products, setProducts] = useState([]);
    const [categoryProductCounts, setCategoryProductCounts] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [imageList, setImageList] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [productsByCategory, setProductsByCategory] = useState([]);
    const [newProductName, setNewProductName] = useState("");
    const [newProductPrice, setNewProductPrice] = useState("");
    const [newProductDescription, setNewProductDescription] = useState("");
    const [newProductIsPromotion, setNewProductIsPromotion] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        fetch("http://localhost:4000/api/admin-dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("No tienes permisos");
            }
            return response.json();
          })
          .then(() => {
            fetchCategories();
          })
          .catch(() => {
            navigate("/");
          });
    
        fetch("http://localhost:4000/api/images")
          .then((response) => response.json())
          .then((data) => setImageList(data))
          .catch((error) => console.error("Error al cargar las imágenes:", error));
      } else {
        navigate("/login");
      }
    }, [ navigate]);
    
    

    const fetchCategories = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:4000/api/admin-dashboard/categories",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) throw new Error("Error al obtener categorías");
        const data = await response.json();
    
        // Normalización y manejo de IDs
        const normalizedData = data.map((category) => ({
          ...category,
          _id: category._id || category.id || `temp-id-${Math.random()}`,
        }));
    
        setCategories(normalizedData);
    
        // Actualizar conteos de productos para todas las categorías
        const counts = {};
        await Promise.all(
          normalizedData.map(async (category) => {
            const productCount = await fetchProductCountByCategory(category._id);
            counts[category._id] = productCount;
          })
        );
        setCategoryProductCounts(counts);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchProductCountByCategory = async (categoryId) => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:4000/api/admin-dashboard/products/${categoryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) return 0;
        const data = await response.json();
        return data.length;
      } catch (error) {
        console.error(error);
        return 0;
      }
    };

    const fetchProductsByCategory = async (categoryId) => {
      if (!categoryId) {
        console.warn("Se intentó cargar productos sin un categoryId válido.");
        setProductsByCategory([]);
        return;
      }
    
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:4000/api/admin-dashboard/products/${categoryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
    
        if (!response.ok) {
          if (response.status === 404) {
            console.warn("No se encontraron productos para esta categoría.");
            setProductsByCategory([]);
            setCategoryProductCounts((prevCounts) => ({
              ...prevCounts,
              [categoryId]: 0, // Aseguramos que el conteo sea 0
            }));
            return;
          }
          throw new Error("Error al obtener productos");
        }
    
        const data = await response.json();
        setProductsByCategory(data || []);
        setCategoryProductCounts((prevCounts) => ({
          ...prevCounts,
          [categoryId]: (data || []).length, // Actualiza el conteo correctamente
        }));
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setProductsByCategory([]);
        setCategoryProductCounts((prevCounts) => ({
          ...prevCounts,
          [categoryId]: 0,
        }));
      }
    };
    
    

    const openModal = async (category = null) => {
      if (category) {
        setCategoryName(category.name);
        setSelectedImage(category.image);
        setEditingCategory(category);
    
        // Cargar productos de la categoría seleccionada
        await fetchProductsByCategory(category._id);
      } else {
        setCategoryName("");
        setSelectedImage(null);
        setEditingCategory(null);
        setProductsByCategory([]);
      }
      setModalOpen(true);
    };

    const closeModal = () => {
      setModalOpen(false);
      setCategoryName("");
      setSelectedImage(null);
      setEditingCategory(null);
      setProductsByCategory([]);
    };

    const handleCreateCategory = async () => {
      if (!categoryName || !selectedImage) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:4000/api/admin-dashboard/categories",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: categoryName, image: selectedImage }),
          }
        );
        if (!response.ok) throw new Error("Error al crear la categoría");
        fetchCategories();
        closeModal();
      } catch (error) {
        console.error(error);
      }
    };

  
    

    const handleDeleteCategory = async (categoryId) => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:4000/api/admin-dashboard/categories/${categoryId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Error al eliminar categoría");
        setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
      } catch (error) {
        console.error(error);
      }
    };
    const handleEditCategory = async () => {
      if (!categoryName || !selectedImage) {
        alert("Por favor, completa todos los campos.");
        return;
      }
    
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:4000/api/admin-dashboard/categories/${editingCategory._id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: categoryName, image: selectedImage }),
          }
        );
        
        if (!response.ok) throw new Error("Error al actualizar la categoría");
        fetchCategories();
        closeModal();
      } catch (error) {
        console.error(error);
      }
    };
    
    const handleAddProduct = async () => {
      if (!newProductName || !newProductPrice || isNaN(newProductPrice)) {
        alert("Por favor, ingresa un nombre y un precio válido.");
        return;
      }
    
      if (!editingCategory || !editingCategory._id) {
        alert("Por favor, selecciona una categoría válida.");
        return;
      }
    
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:4000/api/admin-dashboard/products", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newProductName,
            price: Number(newProductPrice),
            description: newProductDescription,
            isPromotion: newProductIsPromotion,
            categoryId: editingCategory._id,
          }),
        });
    
        if (!response.ok) throw new Error("Error al añadir producto");
    
        const { product } = await response.json();
        setProductsByCategory((prev) => [...prev, product]);
    
        // Incrementar el conteo de productos localmente
        setCategoryProductCounts((prevCounts) => ({
          ...prevCounts,
          [editingCategory._id]: (prevCounts[editingCategory._id] || 0) + 1,
        }));
    
        // Limpiar inputs
        setNewProductName("");
        setNewProductPrice("");
        setNewProductDescription("");
        setNewProductIsPromotion(false);
      } catch (error) {
        console.error(error.message);
        alert("Error al añadir producto");
      }
    };
    
    
    const handleDeleteProduct = async (productId) => {
      if (!editingCategory || !editingCategory._id) {
        console.warn("No se encontró la categoría al eliminar el producto.");
        return;
      }
    
      try {
        const response = await fetch(
          `http://localhost:4000/api/admin-dashboard/products/${productId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
    
        if (!response.ok) {
          throw new Error("Error al eliminar producto");
        }
    
        // Actualizar el estado local
        setProductsByCategory((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
    
        // Decrementar el conteo de productos localmente
        setCategoryProductCounts((prevCounts) => ({
          ...prevCounts,
          [editingCategory._id]: Math.max(
            0,
            (prevCounts[editingCategory._id] || 0) - 1
          ),
        }));
      } catch (error) {
        console.error(error);
      }
    };
    
    return (
      <div className="container mx-auto p-4">
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white ">Categorías</h2>
            <button
              className="btn btn-sm bg-blue-500 hover:bg-blue-700 text-white mt-1"
              onClick={() => openModal()}
            >
              Crear Categoría
            </button>
          </div>
          
        <button
          className="btn bg-red-500 hover:bg-red-700 text-white"
          onClick={() => navigate("/admin-dashboard")}
        >
          Volver al Admin Dashboard
        </button>
      </div>
        {/* Tarjetas de categorías */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 justify-center">
          {categories && categories.length > 0 ? (
            categories.map((category, index) => (
              <div
                key={category?._id || `category-${index}`} // Agregar comprobación de `category`
                className="bg-neutral rounded-lg shadow-md text-white p-4 w-72 max-w-xs"
              >
                {category?.image && (
                  <img
                    src={`/images/${category.image}`}
                    alt={category.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <h3 className="text-lg font-bold mb-2">{category?.name || "Sin nombre"}</h3>
                <p className="text-sm mb-4">
                  Productos: <strong>{categoryProductCounts[category._id] || 0}</strong>
                </p>
                <div className="flex justify-between">
                  <button
                    className="btn btn-sm bg-blue-500 hover:bg-blue-700 text-white"
                    onClick={() => openModal(category)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm bg-red-500 hover:bg-red-700 text-white"
                    onClick={() => handleDeleteCategory(category?._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No hay categorías disponibles.</p>
          )}
        </div>



       

        {/* Modal de creación/edición */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="modal-box w-[90%] max-w-4xl bg-neutral text-white rounded-lg">
              <h3 className="font-bold text-lg mb-4">
                {editingCategory ? "Editar Categoría" : "Crear Categoría"}
              </h3>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Columna izquierda */}
                <div className="flex-1">
                  <label className="text-sm">Nombre de la categoría</label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="input input-bordered w-full bg-neutral text-white mt-2"
                  />
                  <label className="text-sm mt-4 block">Imagen</label>
                  <select
                      value={selectedImage || ""}
                      onChange={(e) => setSelectedImage(e.target.value)}
                      className="select select-bordered w-full bg-neutral text-white mt-2"
                    >
                      <option value="">Selecciona una imagen</option>
                      {imageList.map((image) => (
                        <option key={image} value={image}>
                          {image}
                        </option>
                      ))}
                    </select>
                  {selectedImage && (
                    <img
                      src={`/images/${selectedImage}`}
                      alt="Vista previa"
                      className="w-full h-72 object-cover rounded-md mt-4"
                    />
                  )}
                </div>

                {/* Columna derecha */}
                {editingCategory && (
                  <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-4">Productos de la categoría</h4>
                  <div className="overflow-y-auto max-h-48 bg-gray-800">
                    <table className="table table-zebra w-full text-sm rounded-lg">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Precio</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productsByCategory.length > 0 ? (
                          productsByCategory.map((product, index) => (
                            <tr key={product?._id || `product-${index}`}>
                              <td>{product?.name || "Sin nombre"}</td>
                              <td>${product?.price || "N/A"}</td>
                              <td>
                                <button
                                  className="btn btn-error text-white btn-sm"
                                  onClick={() => handleDeleteProduct(product?._id)}
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3">No hay productos en esta categoría.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                
                  {/* Inputs para añadir productos */}
                  <div className="mt-6">
                    <h5 className="text-md font-semibold mb-2">Añadir Producto</h5>
                    <input
                      type="text"
                      placeholder="Nombre del producto"
                      className="input input-bordered w-full bg-neutral text-white mb-2"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Precio del producto"
                      className="input input-bordered w-full bg-neutral text-white mb-2"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                    />
                    <textarea
                      placeholder="Descripción del producto"
                      className="textarea textarea-bordered w-full bg-neutral text-white mb-2"
                      value={newProductDescription}
                      onChange={(e) => setNewProductDescription(e.target.value)}
                    />
                    <div className="form-control mb-2">
                      <label className="label cursor-pointer">
                        <span className="label-text text-white">¿Es una promoción?</span>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={newProductIsPromotion}
                          onChange={(e) => setNewProductIsPromotion(e.target.checked)}
                        />
                      </label>
                    </div>
                    <button
                      className="btn bg-green-500 hover:bg-green-700 text-white w-full"
                      onClick={handleAddProduct}
                    >
                      Añadir Producto
                    </button>
                  </div>

                </div>
                )}
              </div>

              <div className="modal-action mt-6 flex justify-between">
                <button className="btn btn-error text-white" onClick={closeModal}>
                  Cancelar
                </button>
                <button
                  className="btn bg-blue-500 hover:bg-blue-700 text-white"
                  onClick={editingCategory ? handleEditCategory : handleCreateCategory}
                >
                  {editingCategory ? "Guardar Cambios" : "Crear"}
                </button>

              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

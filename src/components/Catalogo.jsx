import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { Footer } from "./Footer";

const BACKEND_URL = "http://localhost:4000/api/admin-dashboard";

const Catalog = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { addToCart, updateCartCount } = useContext(AppContext); // Usa `addToCart` correctamente
  const token = localStorage.getItem("token"); // Simulación de autenticación

  // Obtener categorías y productos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener categorías
        const categoriesResponse = await fetch(`${BACKEND_URL}/categories`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!categoriesResponse.ok) throw new Error("Error al obtener categorías");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Obtener productos
        const productsResponse = await fetch(`${BACKEND_URL}/products`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!productsResponse.ok) throw new Error("Error al obtener productos");
        const productsData = await productsResponse.json();
        setProducts(productsData);

        // Seleccionar productos aleatorios
        const shuffledProducts = productsData.sort(() => 0.5 - Math.random());
        setRandomProducts(shuffledProducts.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [token]);

  // Agregar al carrito
  const handleAddToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem("items")) || [];
    const existingItemIndex = currentCart.findIndex((item) => item._id === product._id);
    
    // Llamar a la función addToCart del contexto
    addToCart(product);

    if (existingItemIndex !== -1) {
      // Si el producto ya está en el carrito, incrementar la cantidad
      currentCart[existingItemIndex].count += 1;
    } else {
      // Si no está, añadirlo con una cantidad inicial de 1
      currentCart.push({ ...product, count: 1 });
    }

    // Actualizar el carrito en localStorage
    localStorage.setItem("items", JSON.stringify(currentCart));

    // Actualizar el contador de productos en el carrito
    updateCartCount();

    alert(`Producto "${product.name}" añadido al carrito.`);
  };

  // Manejar clic en una categoría
  const handleCategoryClick = async (category) => {
    try {
      const response = await fetch(`${BACKEND_URL}/products/${category._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Error al obtener productos por categoría");
      const data = await response.json();
      setProducts(data);
      setSelectedCategory(category);
    } catch (error) {
      console.error(error);
    }
  };

  // Volver a la vista de categorías sin productos
  const handleBackClick = () => {
    setSelectedCategory(null);
    setProducts([]); // Limpia la lista de productos
  };

  // Modal para mostrar un producto seleccionado
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalOpen(false);
  };

  // Filtrar categorías y productos con la búsqueda
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRandomProducts = randomProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-neutral text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Barra de búsqueda */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Buscar productos o categorías..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full max-w-lg bg-neutral-focus text-white"
          />
        </div>

        {/* Vista de productos y categoría seleccionada */}
        {selectedCategory && (
          <div className="py-8 flex gap-6">
            <div className="w-1/3">
              <div className="card align-middle card-compact bg-base-200 shadow-lg">
                <figure>
                  <img
                    src={`/images/${selectedCategory.image}`}
                    alt={selectedCategory.name}
                    className="w-full h-48 object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{selectedCategory.name}</h2>
                  <button
                    className="btn btn-error btn-block"
                    onClick={handleBackClick}
                  >
                    Volver
                  </button>
                </div>
              </div>
            </div>
            <div className="w-3/4">
                <h2 className="text-2xl font-bold mb-4">Productos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filteredProducts.map((product) => (
                    <div
                        key={product._id}
                        className="card card-compact bg-base-200 shadow-lg hover:shadow-xl cursor-pointer"
                        onClick={() => openProductModal(product)}
                    >
                        <div className="card-body">
                        <h3 className="card-title">{product.name}</h3>
                        {product.isPromotion && (
                            <p className="text-sm text-yellow-400">{product.description}</p>
                        )}
                        <p className="text-sm">Precio: ${product.price}</p>
                        <button
                            className="btn btn-error btn-block"
                            onClick={(e) => {
                            e.stopPropagation(); // Evita abrir el modal al hacer clic en el botón
                            handleAddToCart(product); // Llamar a la nueva función
                            }}
                        >
                            Añadir al carrito
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                </div>

          </div>
        )}

        {/* Listado de categorías */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Categorías</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category._id}
                className="card card-compact bg-base-200 shadow-lg hover:shadow-xl cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                <figure>
                  <img
                    src={`/images/${category.image}`}
                    alt={category.name}
                    className="w-full h-48 object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{category.name}</h2>
                  <button className="btn btn-error btn-block">
                    Ver productos
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productos destacados aleatorios */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Productos destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredRandomProducts.map((product) => (
              <div
                key={product._id}
                className="card card-compact bg-base-200 shadow-lg hover:shadow-xl cursor-pointer"
                onClick={() => openProductModal(product)}
              >
                <div className="card-body">
                  <h3 className="card-title">{product.name}</h3>
                  <p className="text-sm">Precio: ${product.price}</p>
                  <button className="btn btn-error btn-block">
                    Añadir al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal para el producto */}
        {modalOpen && selectedProduct && (
            <div className="modal modal-open">
                <div className="modal-box">
                <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
                {selectedProduct.description && (
                    <p className="py-2 text-gray-300">{selectedProduct.description}</p>
                )}
                <p className="py-4">Precio: ${selectedProduct.price}</p>
                <div className="modal-action">
                    <button className="btn btn-error" onClick={closeModal}>
                    Cerrar
                    </button>
                    <button
                    className="btn btn-success"
                    onClick={() => handleAddToCart(selectedProduct)}
                    >
                    Añadir al carrito
                    </button>
                </div>
                </div>
            </div>
            )}
      </div>
      <Footer />
    </main>
  );
};

export default Catalog;

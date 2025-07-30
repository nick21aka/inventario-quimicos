import { useEffect, useState } from 'react';
import fondo from './assets/fondo.png';

function App() {
  const [productos, setProductos] = useState([]);
  const [productoActivo, setProductoActivo] = useState(null);
  const [pantalla, setPantalla] = useState(null); // null, 'vista', 'agregar'
  const [modo, setModo] = useState(null); // 'movimiento'
  const [tipoMovimiento, setTipoMovimiento] = useState(null); // 'entrada' o 'salida'
  const [cantidad, setCantidad] = useState('');
  const [responsable, setResponsable] = useState('');
  const [mostrarHistorialId, setMostrarHistorialId] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [busqueda, setBusqueda] = useState("");


const productosFiltrados = productos.filter((p) =>
  (p.nombre + p.descripcion + p.unidad).toLowerCase().includes(busqueda.toLowerCase())
);

  const cargarProductos = () => {
    fetch('http://localhost:3000/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al cargar productos:', err));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarHistorial = async (productoId) => {
  try {
    const res = await fetch(`http://localhost:3000/movimientos/${productoId}`);
    const data = await res.json();
    setHistorial(data);
    setMostrarHistorialId(productoId);
  } catch (error) {
    console.error("Error cargando historial:", error);
    alert("Error al obtener historial");
  }
};


  const registrarMovimiento = async () => {
    const ruta = `http://localhost:3000/${tipoMovimiento}`;
    const datos = {
      productoId: productoActivo.id,
      cantidad: parseFloat(cantidad),
      responsable
    };

    const res = await fetch(ruta, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    const respuesta = await res.json();
    alert(respuesta.mensaje);
    cerrarFormulario();
    cargarProductos();
  };

  const abrirFormulario = (producto, tipo) => {
    setProductoActivo(producto);
    setTipoMovimiento(tipo);
    setModo("movimiento");
    setCantidad('');
    setResponsable('');
  };

  const cerrarFormulario = () => {
    setProductoActivo(null);
    setTipoMovimiento(null);
    setModo(null);
    setCantidad('');
    setResponsable('');
  };

  return (
    <div className="relative min-h-screen">
      {/* Imagen de fondo con opacidad */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${fondo})`, opacity: 0.3 }}
      ></div>

      {/* Contenido principal encima del fondo */}
      <div className="relative z-10 min-h-screen w-full flex justify-center items-center px-4">
        <div className="bg-white/80 backdrop-blur-md w-full max-w-6xl p-6 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-center text-green-800 mb-6 flex items-center justify-center gap-2">
            📦 Inventario de Químicos
          </h1>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button onClick={() => setPantalla(null)} className="px-4 py-2 bg-gray-700 text-white rounded shadow hover:opacity-90">
              🏠 Inicio
            </button>
            <button onClick={() => { setPantalla('vista'); cerrarFormulario(); }} className="px-4 py-2 bg-green-600 text-white rounded shadow hover:opacity-90">
              🔍 Ver Inventario
            </button>
            <button onClick={() => { setPantalla('agregar'); setProductoActivo({}); cerrarFormulario(); }} className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:opacity-90">
              ➕ Agregar Producto
            </button>
          </div>

          {pantalla === null && (
            <div className="text-center mt-10">
              <div className="text-6xl mb-4">🧲</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Sistema de Control de Stock</h2>
              <p className="text-gray-600">Selecciona una opción para comenzar</p>
            </div>
          )}

          {pantalla === 'agregar' && (
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <h2 className="text-xl font-bold mb-4 text-center">Nuevo Producto</h2>

             <div className="grid sm:grid-cols-2 gap-4">
  
  
  
  {/* ─────────── NOMBRE (input + datalist) ─────────── */}
  <input
    list="listaNombres"
    placeholder="Nombre"
    className="border p-2 rounded w-full"
    value={productoActivo?.nombre || ""}
    onChange={(e) =>
      setProductoActivo({ ...productoActivo, nombre: e.target.value })
    }
  />
  <datalist id="listaNombres">
    <option value="Ácido Clorhídrico" />
    <option value="Soda Cáustica" />
    <option value="Cloro Líquido" />
    <option value="Ácido Nítrico" />
    {/* Agrega/quita según tus químicos */}
  </datalist>

  {/* ─────────── DESCRIPCIÓN (input + datalist) ─────────── */}
  <input
    list="listaDescripciones"
    placeholder="Descripción"
    className="border p-2 rounded w-full"
    value={productoActivo?.descripcion || ""}
    onChange={(e) =>
      setProductoActivo({ ...productoActivo, descripcion: e.target.value })
    }
  />
  <datalist id="listaDescripciones">
    <option value="Usado para limpieza industrial" />
    <option value="Reactivo alcalino" />
    <option value="Desinfectante alimentario" />
    <option value="Oxidante fuerte" />
  </datalist>

  {/* ─────────── UNIDAD (input + datalist) ─────────── */}
  <input
    list="listaUnidades"
    placeholder="Unidad (kg, litros…)"
    className="border p-2 rounded w-full"
    value={productoActivo?.unidad || ""}
    onChange={(e) =>
      setProductoActivo({ ...productoActivo, unidad: e.target.value })
    }
  />
  <datalist id="listaUnidades">
    <option value="kg" />
    <option value="litros" />
    <option value="toneladas" />
    <option value="galones" />
  </datalist>

  {/* ─────────── STOCK INICIAL ─────────── */}
  <input
    type="number"
    placeholder="Stock inicial"
    className="border p-2 rounded w-full"
    value={productoActivo?.stock || ""}
    onChange={(e) =>
      setProductoActivo({ ...productoActivo, stock: e.target.value })
    }
  />

  {/* ─────────── STOCK MÍNIMO ─────────── */}
  <input
    type="number"
    placeholder="Stock mínimo"
    className="border p-2 rounded w-full"
    value={productoActivo?.stock_minimo || ""}
    onChange={(e) =>
      setProductoActivo({ ...productoActivo, stock_minimo: e.target.value })
    }
  />

  {/* ─────────── FECHA DE VENCIMIENTO ─────────── */}
  <input
    type="date"
    className="border p-2 rounded w-full"
    value={productoActivo?.fecha_vencimiento || ""}
    onChange={(e) =>
      setProductoActivo({
        ...productoActivo,
        fecha_vencimiento: e.target.value,
      })
    }
  />
</div>


              <div className="flex justify-center gap-4 mt-6">
                <button className="bg-green-600 text-white px-6 py-2 rounded shadow"
                  onClick={async () => {
                    const p = productoActivo;
                    if (!p.nombre || !p.descripcion || !p.unidad || !p.stock || !p.stock_minimo) {
                      alert("Completa todos los campos obligatorios.");
                      return;
                    }
                    const res = await fetch('http://localhost:3000/producto', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(p),
                    });
                    const resultado = await res.json();
                    alert(resultado.mensaje);
                    setPantalla("vista");
                    cargarProductos();
                  }}>
                  Guardar
                </button>
                <button className="bg-gray-400 text-white px-6 py-2 rounded shadow"
                  onClick={() => {
                    cerrarFormulario();
                    setPantalla("vista");
                  }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
          



    

          {pantalla === "vista" &&  productosFiltrados.map((producto) => {
            const estaVencido = producto.fecha_vencimiento && new Date(producto.fecha_vencimiento) < new Date();
            const stockBajo = producto.stock <= producto.stock_minimo;

            return (
              <div key={producto.id} className={`rounded-xl shadow-md p-4 mb-4 border-2 ${
                estaVencido ? 'bg-red-100 border-red-400'
                  : stockBajo ? 'bg-yellow-100 border-yellow-400'
                    : 'bg-white border-gray-200'
              }`}>
                <h2 className="text-lg font-bold text-green-800">{producto.nombre}</h2>
                <p className="text-sm text-gray-600">{producto.descripcion}</p>
                <p><strong>Stock:</strong> {producto.stock} {producto.unidad}</p>
                <p><strong>Mínimo:</strong> {producto.stock_minimo}</p>
                {producto.fecha_vencimiento && (
                  <p><strong>Vence:</strong> {new Date(producto.fecha_vencimiento).toLocaleDateString()}</p>
                )}

                {estaVencido && <p className="text-red-600 font-semibold">⚠️ Producto Vencido</p>}
                {!estaVencido && stockBajo && <p className="text-yellow-600 font-semibold">⚠️ Stock bajo</p>}

                <div className="flex flex-wrap gap-2 mt-3">
                  <button className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => abrirFormulario(producto, "entrada")}>Entrada</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => abrirFormulario(producto, "salida")}>Salida</button>
                  <button className="bg-gray-600 text-white px-3 py-1 rounded"
                    onClick={async () => {
                      const confirmar = confirm(`¿Eliminar "${producto.nombre}"?`);
                      if (!confirmar) return;
                      const res = await fetch(`http://localhost:3000/producto/${producto.id}`, { method: 'DELETE' });
                      const resultado = await res.json();
                      alert(resultado.mensaje);
                      cargarProductos();
                    }}>Eliminar</button>
                    <button
                     className="bg-blue-800 text-white px-3 py-1 rounded"
                     onClick={() => cargarHistorial(producto.id)}
                    >
                     📜 Ver Historial
                  </button>

                </div>

                {productoActivo?.id === producto.id && modo === "movimiento" && (
                  <div className="mt-4 p-3 bg-white border rounded-lg">
                    <h3 className="font-semibold mb-2 text-center">
                      Registrar {tipoMovimiento === 'entrada' ? 'Entrada' : 'Salida'}
                    </h3>
                    <input
                      type="number"
                      placeholder="Cantidad"
                      className="w-full border rounded p-2 mb-2"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                    />
                    <input
  list="responsables"
  placeholder="Responsable"
  className="w-full border rounded p-2 mb-2"
  value={responsable}
  onChange={(e) => setResponsable(e.target.value)}
/>
<datalist id="responsables">
  <option value="Nicolás Silva" />
  <option value="Claudia Soto" />
  <option value="Vicente Hernández" />
  <option value="José Luis" />
</datalist>

                    <div className="flex gap-2 justify-center">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={registrarMovimiento}>
                        Confirmar
                      </button>
                      <button
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                        onClick={cerrarFormulario}>
                        Cancelar
                      </button>
                    </div>
                  </div>

                )}
                {mostrarHistorialId === producto.id && (
  <div className="mt-4 p-3 bg-white border rounded-lg">
    <h3 className="font-semibold mb-2">Historial de Movimientos</h3>
    {historial.length === 0 ? (
      <p className="text-gray-500">No hay movimientos registrados.</p>
    ) : (
      <ul className="text-sm">
        {historial.map((m) => (
          <li key={m.id} className="mb-1">
            📅 {new Date(m.fecha).toLocaleDateString()} – <strong>{m.tipo}</strong> de {m.cantidad} por {m.responsable}
          </li>
        ))}
      </ul>
    )}
    <button
      className="mt-2 text-sm text-blue-600 underline"
      onClick={() => setMostrarHistorialId(null)}
    >
      Ocultar historial
    </button>
  </div>
)}

              </div>
              
            );
          })}

        </div>
      </div>
    </div>
  );
}

export default App;

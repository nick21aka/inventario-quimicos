const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());



app.post('/producto', async (req, res) => {
  const { nombre, descripcion, unidad, stock, stock_minimo, fecha_vencimiento } = req.body;

  const nuevo = await prisma.producto.create({
    data: {
      nombre,
      descripcion,
      unidad,
      stock: parseFloat(stock),
      stock_minimo: parseFloat(stock_minimo),
      fecha_vencimiento: fecha_vencimiento ? new Date(fecha_vencimiento) : null
    }
  });

  res.json({ mensaje: "Producto creado", producto: nuevo });
});
app.delete('/producto/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    // Eliminar movimientos primero
    await prisma.movimiento.deleteMany({
      where: { productoId: id }
    });

    // Luego eliminar el producto
    await prisma.producto.delete({
      where: { id }
    });

    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(500).json({ mensaje: "Error al eliminar producto", error });
  }
});

// Login de usuario
app.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { correo } });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const valido = await bcrypt.compare(password, usuario.password);

    if (!valido) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // No devolvemos la contraseña
    const { id, nombre, rol } = usuario;
    res.json({ id, nombre, rol });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: 'Error interno' });
  }
});

// Obtener historial de movimientos por producto
app.get('/movimientos/:id', async (req, res) => {
  const productoId = parseInt(req.params.id);

  try {
    const movimientos = await prisma.movimiento.findMany({
      where: { productoId },
      orderBy: { fecha: 'desc' }, // últimos primero
    });

    res.json(movimientos);
  } catch (error) {
    console.error("Error obteniendo movimientos:", error);
    res.status(500).json({ mensaje: 'Error al obtener historial' });
  }
});


// Mostrar todos los productos
app.get('/productos', async (req, res) => {
  const productos = await prisma.producto.findMany();
  res.json(productos);
});

// Registrar entrada de producto
app.post('/entrada', async (req, res) => {
  const { productoId, cantidad, responsable } = req.body;

  const producto = await prisma.producto.update({
    where: { id: productoId },
    data: { stock: { increment: cantidad } },
  });

  await prisma.movimiento.create({
    data: {
      tipo: 'entrada',
      cantidad,
      responsable,
      productoId
    }
  });

  res.json({ mensaje: 'Entrada registrada', producto });
});

// Registrar salida de producto
app.post('/salida', async (req, res) => {
  const { productoId, cantidad, responsable } = req.body;

  const producto = await prisma.producto.update({
    where: { id: productoId },
    data: { stock: { decrement: cantidad } },
  });

  await prisma.movimiento.create({
    data: {
      tipo: 'salida',
      cantidad,
      responsable,
      productoId
    }
  });

  res.json({ mensaje: 'Salida registrada', producto });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



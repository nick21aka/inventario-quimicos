const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function crearUsuario() {
  const nombre = "Hardy Supervisor";
  const correo = "hardy@empresa.com";
  const passwordPlano = "1234";
  const rol = "supervisor";

  // Encriptar contraseña
  const passwordHasheada = await bcrypt.hash(passwordPlano, 10);

  try {
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        password: passwordHasheada,
        rol,
      },
    });
    console.log("✅ Usuario creado:", usuario);
  } catch (error) {
    console.error("❌ Error al crear usuario:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

crearUsuario();

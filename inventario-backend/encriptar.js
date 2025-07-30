const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function encriptarUsuarios() {
  const usuarios = await prisma.usuario.findMany();

  for (let usuario of usuarios) {
    // Si ya está encriptado, saltarlo
    if (usuario.password.startsWith('$2b$')) continue;

    const hash = await bcrypt.hash(usuario.password, 10);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { password: hash },
    });

    console.log(`Contraseña encriptada para: ${usuario.nombre}`);
  }

  await prisma.$disconnect();
}

encriptarUsuarios().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});

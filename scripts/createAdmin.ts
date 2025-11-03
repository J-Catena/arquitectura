const { prisma } = require("../lib/prisma");
const bcrypt = require("bcryptjs");

async function main() {
    const email = "admin@admin.com";
    const password = "admin123";

    // 🔐 Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧭 Comprobar si ya existe
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
        console.log("⚠️ Ya existe un usuario administrador con este email.");
        console.log(`Email: ${email}`);
        return;
    }

    // 🆕 Crear usuario
    const user = await prisma.user.create({
        data: {
            name: "Administrador",
            email,
            password: hashedPassword,
        },
    });

    console.log("✅ Usuario administrador creado correctamente:");
    console.log(`Email: ${user.email}`);
    console.log(`Contraseña: ${password}`);
}

main()
    .catch((e) => {
        console.error("❌ Error creando el usuario:", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

// apps/web/app/api/login/route.ts
import { NextResponse } from "next/server";
import { eq,db } from "@automatizacion_whatsapp/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { usuarios } from "@automatizacion_whatsapp/db/schema/example";


const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-key-para-desarrollo",
);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Buscar usuario en la base de datos Neon usando Drizzle
    const [user] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    // 2. Verificar la contraseña (OJO: asume que guardaste el hash en la columna 'password')
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    // 3. Generar JWT (Token de sesión)
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h") // Expira en 1 día
      .sign(JWT_SECRET);

    // 4. Establecer Cookie de sesión segura (HTTP-Only)
    const cookieStore = await cookies();
    cookieStore.set("n8n_session", token, {
      httpOnly: true, // Evita lectura desde JavaScript (protección XSS)
      secure: process.env.NODE_ENV === "production", // Solo HTTPS en prod
      sameSite: "lax", // Protección CSRF
      maxAge: 60 * 60 * 24, // 1 día en segundos
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Login exitoso" });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

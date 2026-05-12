export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db, desc, contactos } from "@automatizacion_whatsapp/db";
import { z } from "zod";
import { contactoSchema } from "@/lib/validations/contactos";

// LEER (READ): Obtener todos los contactos
export async function GET() {
  try {
    // desc() ordena para que los más nuevos salgan primero
    const data = await db
      .select()
      .from(contactos)
      .orderBy(desc(contactos.createdAt));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error GET contactos:", error);
    return NextResponse.json(
      { success: false, error: "Error interno al obtener contactos" },
      { status: 500 },
    );
  }
}

// CREAR (CREATE): Insertar un nuevo contacto
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validación estricta con Zod
    const result = contactoSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: z.treeifyError(result.error) },
        { status: 400 },
      );
    }

    // 2. Inserción en Drizzle / Neon
    const nuevoContacto = await db
      .insert(contactos)
      .values({
        nombre: result.data.nombre,
        numero: result.data.numero,
      })
      .returning(); // Crucial: devuelve el registro recién creado con su UUID

    return NextResponse.json(
      {
        success: true,
        data: nuevoContacto[0],
        message: "Contacto creado exitosamente",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error POST contacto:", error);

    // Captura de error de Postgres: Código 23505 = Violación de constraint UNIQUE (número repetido)
    if (error.code === "23505") {
      return NextResponse.json(
        { success: false, error: "Este número de WhatsApp ya está registrado" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Error interno al crear contacto" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    // En Drizzle, ejecutar delete sin .where() borra todos los registros de la tabla
    const result = await db.delete(contactos).returning();

    return NextResponse.json({
      success: true,
      message: `Se han eliminado los ${result.length} contactos correctamente`,
      count: result.length,
    });
  } catch (error) {
    console.error("Error al eliminar todos los contactos:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno al intentar vaciar la lista de contactos",
      },
      { status: 500 },
    );
  }
}

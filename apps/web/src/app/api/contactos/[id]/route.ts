export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db, eq, contactos } from "@automatizacion_whatsapp/db";
import { contactoSchema } from "@/lib/validations/contactos";

// ACTUALIZAR (UPDATE)
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const result = contactoSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const contactoActualizado = await db
      .update(contactos)
      .set({
        nombre: result.data.nombre,
        numero: result.data.numero,
        updatedAt: new Date(), // Forzamos la actualización del timestamp
      })
      .where(eq(contactos.id, id))
      .returning();

    if (contactoActualizado.length === 0) {
      return NextResponse.json(
        { success: false, error: "Contacto no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: contactoActualizado[0],
      message: "Contacto actualizado",
    });
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json(
        { success: false, error: "Este número ya pertenece a otro contacto" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Error al actualizar contacto" },
      { status: 500 },
    );
  }
}

// BORRAR (DELETE)
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const contactoEliminado = await db
      .delete(contactos)
      .where(eq(contactos.id, id))
      .returning();

    if (contactoEliminado.length === 0) {
      return NextResponse.json(
        { success: false, error: "Contacto no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Contacto eliminado correctamente",
    });
  } catch (error) {
    console.error("Error DELETE contacto:", error);
    return NextResponse.json(
      { success: false, error: "Error interno al eliminar contacto" },
      { status: 500 },
    );
  }
}

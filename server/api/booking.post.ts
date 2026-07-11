import prisma from "../lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { name, email, phone, date, hour, sectorId } = body;

    // 1. Validación básica de campos obligatorios
    if (!name || !email || !phone || !date || hour === undefined || !sectorId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Faltan campos obligatorios en el formulario.",
      });
    }

    // 2. Conversión de tipos para el nuevo esquema de Prisma
    const targetSectorId = parseInt(sectorId);
    const targetHour = parseInt(hour);

    // Normalizamos la fecha a las 00:00:00 para evitar desajustes de zona horaria
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // 3. Inserción directa vinculando el sectorId
    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        phone,
        date: targetDate,
        hour: targetHour,
        sectorId: targetSectorId,
      },
    });

    return {
      success: true,
      booking,
      message: "¡Reserva creada correctamente!"
    };

  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error("Error en el servidor:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error interno del servidor al procesar la reserva.",
    });
  }
});

import prisma from "../lib/prisma";

export default eventHandler(async (event) => {
  try {
    const sectors = await prisma.sector.findMany();
    return sectors;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error al obtener los sectores",
    });
  }
});

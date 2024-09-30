// src/pages/api/weather.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Obtener todos los datos de la tabla 'weather_data'
      const weatherData = await prisma.weather_data.findMany();

      // Devolver los datos obtenidos como respuesta
      res.status(200).json(weatherData);
    } catch (error) {
      console.error("Error al obtener los datos del clima:", error);
      res.status(500).json({ message: "Error al obtener los datos del clima" });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}

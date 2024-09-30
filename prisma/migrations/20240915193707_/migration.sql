/*
  Warnings:

  - You are about to drop the `WeatherData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "WeatherData";

-- CreateTable
CREATE TABLE "weather_data" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "temperature" DECIMAL(65,30) NOT NULL,
    "humidity" DECIMAL(65,30) NOT NULL,
    "pressure" DECIMAL(65,30) NOT NULL,
    "wind_speed" DECIMAL(65,30) NOT NULL,
    "gust_speed" DECIMAL(65,30) NOT NULL,
    "wind_direction" TEXT NOT NULL,
    "rain" DECIMAL(65,30) NOT NULL,
    "rain_rate" DECIMAL(65,30) NOT NULL,
    "solar_radiation" DECIMAL(65,30) NOT NULL,
    "evapotranspiration" DECIMAL(65,30) NOT NULL,
    "uv_index" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "weather_data_pkey" PRIMARY KEY ("id")
);

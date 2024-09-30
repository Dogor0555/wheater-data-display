/*
  Warnings:

  - You are about to drop the column `createdAt` on the `WeatherData` table. All the data in the column will be lost.
  - You are about to drop the column `windSpeed` on the `WeatherData` table. All the data in the column will be lost.
  - You are about to alter the column `temperature` on the `WeatherData` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `humidity` on the `WeatherData` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `rain` on the `WeatherData` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `pressure` on the `WeatherData` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to drop the `weather_data` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `evapotranspiration` to the `WeatherData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gust_speed` to the `WeatherData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rain_rate` to the `WeatherData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solar_radiation` to the `WeatherData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uv_index` to the `WeatherData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wind_direction` to the `WeatherData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wind_speed` to the `WeatherData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WeatherData" DROP COLUMN "createdAt",
DROP COLUMN "windSpeed",
ADD COLUMN     "evapotranspiration" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "gust_speed" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "rain_rate" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "solar_radiation" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "uv_index" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "wind_direction" TEXT NOT NULL,
ADD COLUMN     "wind_speed" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "date" SET DATA TYPE TEXT,
ALTER COLUMN "temperature" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "humidity" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "rain" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "pressure" SET DATA TYPE DECIMAL(65,30);

-- DropTable
DROP TABLE "weather_data";

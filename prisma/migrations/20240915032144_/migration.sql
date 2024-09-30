-- CreateTable
CREATE TABLE "WeatherData" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "windSpeed" DOUBLE PRECISION NOT NULL,
    "rain" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pressure" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WeatherData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weather_data" (
    "date" VARCHAR(10),
    "temperature" DECIMAL,
    "humidity" DECIMAL,
    "pressure" DECIMAL,
    "wind_speed" DECIMAL,
    "gust_speed" DECIMAL,
    "wind_direction" VARCHAR(10),
    "rain" DECIMAL,
    "rain_rate" DECIMAL,
    "solar_radiation" DECIMAL,
    "evapotranspiration" DECIMAL,
    "uv_index" DECIMAL
);

-- CreateTable
CREATE TABLE "web_links" (
    "id" SERIAL NOT NULL,
    "link_text" TEXT,
    "link_href" TEXT,

    CONSTRAINT "web_links_pkey" PRIMARY KEY ("id")
);

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SPORT', 'FOOD', 'SOLIDAIRE', 'VOYAGE');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'UPCOMING', 'OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id_user" SERIAL NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "event" (
    "id_event" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3),
    "price" INTEGER NOT NULL,
    "image" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "category" "Category" NOT NULL,
    "description" TEXT NOT NULL,
    "lieu" TEXT NOT NULL,
    "nbr_place" INTEGER NOT NULL,
    "level" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id_event")
);

-- CreateTable
CREATE TABLE "reservation" (
    "id_reservation" SERIAL NOT NULL,
    "id_event" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "stripe_session_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id_reservation")
);

-- CreateTable
CREATE TABLE "gallery_photo" (
    "id_photo" SERIAL NOT NULL,
    "id_event" INTEGER,
    "url" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_photo_pkey" PRIMARY KEY ("id_photo")
);

-- CreateTable
CREATE TABLE "contact_message" (
    "id_message" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_message_pkey" PRIMARY KEY ("id_message")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "event_slug_key" ON "event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "reservation_stripe_session_id_key" ON "reservation"("stripe_session_id");

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_id_event_fkey" FOREIGN KEY ("id_event") REFERENCES "event"("id_event") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_photo" ADD CONSTRAINT "gallery_photo_id_event_fkey" FOREIGN KEY ("id_event") REFERENCES "event"("id_event") ON DELETE SET NULL ON UPDATE CASCADE;

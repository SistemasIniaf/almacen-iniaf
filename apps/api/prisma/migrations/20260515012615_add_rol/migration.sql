/*
  Warnings:

  - Added the required column `rol` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "usuario" ADD COLUMN     "rol" TEXT NOT NULL;

import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { Sequelize } from "sequelize";

const storage = process.env.DB_STORAGE ?? resolve("data", "produtos.sqlite");
if (storage !== ":memory:") mkdirSync(dirname(storage), { recursive: true });

export const sequelize = new Sequelize({ dialect: "sqlite", storage, logging: false });

export async function conectarBanco(): Promise<void> {
  await sequelize.authenticate();
  await sequelize.sync();
}

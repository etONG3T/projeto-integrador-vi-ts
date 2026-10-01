import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

export interface IProduto {
  id: number;
  nome: string;
  preco: number;
}

export type CriarProdutoDTO = Omit<IProduto, "id">;

export class Produto extends Model<IProduto, Optional<IProduto, "id">> implements IProduto {
  declare id: number;
  declare nome: string;
  declare preco: number;
}

Produto.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING(100), allowNull: false },
  preco: { type: DataTypes.DOUBLE, allowNull: false }
}, { sequelize, tableName: "produtos", timestamps: false });

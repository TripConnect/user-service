import {Table, Column, Model, DataType, PrimaryKey, NotNull} from 'sequelize-typescript';
import {DataTypes} from "sequelize";

@Table({
    tableName: 'user_credential',
    timestamps: false,
})
export default class UserCredential extends Model {
    @PrimaryKey
    @Column({
        type: DataTypes.UUID,
        allowNull: false,
    })
    user_id!: string;

    @NotNull
    @Column
    credential!: string;
}

import {Table, Column, Model, DataType, PrimaryKey, Default, Unique, NotNull, AllowNull} from 'sequelize-typescript';
import {DataTypes} from "sequelize";

@Table({
    tableName: 'user',
    timestamps: false,
})
export default class User extends Model {
    @PrimaryKey
    @Column({
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    })
    declare id: string;

    @NotNull
    @Column
    display_name!: string;

    @NotNull
    @Column
    avatar!: string;

    @NotNull
    @Unique
    @Column
    username!: string;

    @NotNull
    @Column
    created_at!: Date;

    @Default(null)
    @AllowNull
    @Column
    updated_at: Date | null = null;

    @Default(false)
    @Column
    enabled_twofa: boolean = false;
}

import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'user',
    timestamps: false,
})
export default class User extends Model {
    @Column({ type: DataType.STRING, primaryKey: true })
    declare id: string;

    @Column({ type: DataType.STRING })
    display_name!: string;

    @Column({ type: DataType.STRING, allowNull: true })
    avatar!: string;

    @Column({ type: DataType.STRING })
    username!: string;

    @Column({ type: DataType.DATE })
    created_at!: Date;

    @Column({ type: DataType.DATE })
    updated_at!: Date;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    enabled_twofa: boolean = false;
}

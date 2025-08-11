import { Table, Column, Model, DataType } from 'sequelize-typescript';
@Table({
    tableName: 'user_credential',
    timestamps: false,
})
export default class UserCredential extends Model {
    @Column({ type: DataType.STRING, primaryKey: true })
    declare user_id: string;

    @Column({ type: DataType.STRING })
    credential!: string;
}

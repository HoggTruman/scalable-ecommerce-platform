import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Login {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ip!: string;

    @Column({type: "bigint"})
    loginAt!: string;

    @ManyToOne(() => User, (user) => user.logins, {
        onDelete: "CASCADE",
        orphanedRowAction: "delete",
    })
    user!: User;
}
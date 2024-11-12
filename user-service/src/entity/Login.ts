import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Login {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ip!: number;

    @Column()
    loginAt!: number;

    @ManyToOne(() => User, (user) => user.logins)
    user!: User;
}
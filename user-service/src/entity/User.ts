import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Login } from "./Login";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    email!: string;

    @Column({length: 60})
    password!: string;

    // as unix timestamp
    @Column()
    registeredAt!: number;

    @OneToMany(() => Login, (login) => login.user, {
        cascade: true
    })
    logins!: Login[];
}
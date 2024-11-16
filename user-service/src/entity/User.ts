import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Login } from "./Login";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({unique: true})
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
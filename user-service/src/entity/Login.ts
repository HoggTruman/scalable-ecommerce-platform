import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Login {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ip!: number;

    @Column()
    loginAt!: number;

}
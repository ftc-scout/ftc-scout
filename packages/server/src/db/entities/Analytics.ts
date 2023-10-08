import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Analytics extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    url!: string;

    @Column("varchar", { nullable: true })
    fromUrl!: string | null;

    @Column()
    sessionId!: string;

    @Column()
    userId!: string;

    @Column()
    browser!: string;

    @Column()
    deviceType!: string;

    @Column("timestamptz")
    date!: Date;
}

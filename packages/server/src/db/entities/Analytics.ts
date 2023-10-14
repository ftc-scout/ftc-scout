import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Analytics extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Index()
    url!: string;

    @Column("varchar", { nullable: true })
    @Index()
    fromUrl!: string | null;

    @Column()
    @Index()
    pathChanged!: boolean;

    @Column()
    @Index()
    sessionId!: string;

    @Column()
    @Index()
    userId!: string;

    @Column()
    @Index()
    browser!: string;

    @Column()
    @Index()
    deviceType!: string;

    @Column("timestamptz")
    @Index()
    date!: Date;
}

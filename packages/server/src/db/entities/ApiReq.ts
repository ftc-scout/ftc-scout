import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Request, Response, NextFunction } from "express";
import { FRONTEND_CODE } from "../../constants";

@Entity()
export class ApiReq extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("json")
    headers!: JSON;

    @Column("json")
    req!: JSON;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;
}

// Log uses of our api that aren't the frontend.
export function apiLoggerMiddleware(req: Request, _: Response, next: NextFunction) {
    if (!(FRONTEND_CODE in req.headers)) {
        ApiReq.save({ req: req.body, headers: req.rawHeaders as any });
    }
    next();
}

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Check,
    Unique
} from 'typeorm';

@Entity('automation_model')
@Unique(['name', 'position'])
@Check('"port" >= 0 AND "port" <= 65535')
@Check('"position" >= 0')
export class Automation {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    image: string;

    @Column({ type: 'varchar', length: 50 })
    host: string;

    @Column({ type: 'int' })
    port: number;

    @Column({ type: 'int', unique: true })
    position: number;
}

import {
  AfterInsert,
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  password_hash: string;

  @Column('varchar')
  first_name: string;

  @Column('varchar')
  last_name: string;

  @Column({ default: false, type: 'boolean' })
  email_verified: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  last_updated_at: Date;

  @Column('date')
  password_changed_at: Date;

  @VersionColumn()
  version: number;

  @AfterInsert()
  @AfterLoad()
  removeFields() {
    delete this.password_changed_at;
    delete this.created_at;
    delete this.last_updated_at;
    delete this.version;
  }
}

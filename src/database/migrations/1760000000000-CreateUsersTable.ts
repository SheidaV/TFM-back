import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CreateUsersTable1760000000000 implements MigrationInterface {
  name = 'CreateUsersTable1760000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'surname',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'alias',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'birth_date',
            type: 'date',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'is_admin',
            type: 'boolean',
            default: false,
          },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
        uniques: [
          new TableUnique({
            name: 'UQ_users_email',
            columnNames: ['email'],
          }),
          new TableUnique({
            name: 'UQ_users_alias',
            columnNames: ['alias'],
          }),
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}

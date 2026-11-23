import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTripsTables1764000000000 implements MigrationInterface {
  name = 'CreateTripsTables1764000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          { name: 'id', type: 'integer', isPrimary: true },
          { name: 'name', type: 'varchar', length: '30', isUnique: true },
        ],
      }),
      true,
    );
    await queryRunner.query(
      `INSERT INTO roles (id, name) VALUES (1, 'owner'), (2, 'participant')`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'trips',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'owner_id', type: 'uuid' },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'destination', type: 'varchar', length: '150' },
          { name: 'start_date', type: 'date' },
          { name: 'end_date', type: 'date' },
          {
            name: 'budget',
            type: 'numeric',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          { name: 'createdAt', type: 'timestamptz', default: 'now()' },
          { name: 'updatedAt', type: 'timestamptz', default: 'now()' },
        ],
        checks: [
          { name: 'CHK_trips_dates', expression: '"end_date" >= "start_date"' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'trips',
      new TableForeignKey({
        name: 'FK_trips_owner',
        columnNames: ['owner_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'trip_participants',
        columns: [
          { name: 'trip_id', type: 'uuid', isPrimary: true },
          { name: 'user_id', type: 'uuid', isPrimary: true },
          { name: 'role_id', type: 'integer' },
          { name: 'createdAt', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKeys('trip_participants', [
      new TableForeignKey({
        name: 'FK_trip_participants_trip',
        columnNames: ['trip_id'],
        referencedTableName: 'trips',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_trip_participants_user',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_trip_participants_role',
        columnNames: ['role_id'],
        referencedTableName: 'roles',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('trip_participants');
    await queryRunner.dropTable('trips');
    await queryRunner.dropTable('roles');
  }
}

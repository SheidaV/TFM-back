import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class CreatePreferencesTable1764200000000 implements MigrationInterface {
  name = 'CreatePreferencesTable1764200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'preferences',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'user_id', type: 'uuid' },
          { name: 'trip_id', type: 'uuid' },
          { name: 'food', type: 'text', isArray: true, default: "'{}'" },
          { name: 'activities', type: 'text', isArray: true, default: "'{}'" },
          { name: 'updatedAt', type: 'timestamptz', default: 'now()' },
        ],
        uniques: [
          new TableUnique({
            name: 'UQ_preferences_trip_user',
            columnNames: ['trip_id', 'user_id'],
          }),
        ],
      }),
      true,
    );

    // clean preferences if user deleted
    await queryRunner.createForeignKey(
      'preferences',
      new TableForeignKey({
        name: 'FK_preferences_participant',
        columnNames: ['trip_id', 'user_id'],
        referencedTableName: 'trip_participants',
        referencedColumnNames: ['trip_id', 'user_id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('preferences');
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateItineraryTables1764500000000 implements MigrationInterface {
  name = 'CreateItineraryTables1764500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'itinerary_days',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'trip_id', type: 'uuid' },
          { name: 'date', type: 'date' },
        ],
        uniques: [
          {
            name: 'UQ_itinerary_days_trip_date',
            columnNames: ['trip_id', 'date'],
          },
        ],
        foreignKeys: [
          {
            name: 'FK_itinerary_days_trip',
            columnNames: ['trip_id'],
            referencedTableName: 'trips',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'itinerary_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'day_id', type: 'uuid' },
          { name: 'proposal_id', type: 'uuid', isUnique: true },
          { name: 'position', type: 'int', default: 0 },
          { name: 'start_time', type: 'time' },
          { name: 'end_time', type: 'time' },
        ],
        checks: [
          {
            name: 'CHK_itinerary_items_times',
            expression: '"end_time" > "start_time"',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('itinerary_items', [
      new TableForeignKey({
        name: 'FK_itinerary_items_day',
        columnNames: ['day_id'],
        referencedTableName: 'itinerary_days',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_itinerary_items_proposal',
        columnNames: ['proposal_id'],
        referencedTableName: 'proposals',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('itinerary_items');
    await queryRunner.dropTable('itinerary_days');
  }
}

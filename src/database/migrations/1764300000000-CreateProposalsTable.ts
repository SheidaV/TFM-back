import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateProposalsTable1764300000000 implements MigrationInterface {
  name = 'CreateProposalsTable1764300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'proposals',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'trip_id', type: 'uuid' },
          { name: 'created_by', type: 'uuid' },
          { name: 'type', type: 'varchar', length: '20' },
          { name: 'title', type: 'varchar', length: '120' },
          { name: 'description', type: 'text', isNullable: true },
          {
            name: 'cost',
            type: 'numeric',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'location',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'location_lat',
            type: 'double precision',
            isNullable: true,
          },
          {
            name: 'location_lon',
            type: 'double precision',
            isNullable: true,
          },
          { name: 'diet_tags', type: 'text', isArray: true, default: "'{}'" },
          { name: 'createdAt', type: 'timestamptz', default: 'now()' },
        ],
        checks: [
          {
            name: 'CHK_proposals_type',
            expression: "\"type\" IN ('activity', 'restaurant')",
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('proposals', [
      new TableForeignKey({
        name: 'FK_proposals_trip',
        columnNames: ['trip_id'],
        referencedTableName: 'trips',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_proposals_creator',
        columnNames: ['created_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('proposals');
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateVotesTable1764400000000 implements MigrationInterface {
  name = 'CreateVotesTable1764400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // primary key (proposal_id, user_id): one vote per person and proposal
    await queryRunner.createTable(
      new Table({
        name: 'votes',
        columns: [
          { name: 'proposal_id', type: 'uuid', isPrimary: true },
          { name: 'user_id', type: 'uuid', isPrimary: true },
          { name: 'trip_id', type: 'uuid' },
          { name: 'value', type: 'smallint' },
          { name: 'createdAt', type: 'timestamptz', default: 'now()' },
          { name: 'updatedAt', type: 'timestamptz', default: 'now()' },
        ],
        checks: [{ name: 'CHK_votes_value', expression: '"value" IN (1, -1)' }],
      }),
      true,
    );

    await queryRunner.createForeignKeys('votes', [
      new TableForeignKey({
        name: 'FK_votes_proposal',
        columnNames: ['proposal_id'],
        referencedTableName: 'proposals',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_votes_participant',
        columnNames: ['trip_id', 'user_id'],
        referencedTableName: 'trip_participants',
        referencedColumnNames: ['trip_id', 'user_id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('votes');
  }
}

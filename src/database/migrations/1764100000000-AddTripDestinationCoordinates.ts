import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTripDestinationCoordinates1764100000000 implements MigrationInterface {
  name = 'AddTripDestinationCoordinates1764100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('trips', [
      new TableColumn({
        name: 'destination_lat',
        type: 'double precision',
        isNullable: true,
      }),
      new TableColumn({
        name: 'destination_lon',
        type: 'double precision',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('trips', 'destination_lon');
    await queryRunner.dropColumn('trips', 'destination_lat');
  }
}

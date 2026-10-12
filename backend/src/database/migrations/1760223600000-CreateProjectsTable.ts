
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProjectsTable1760223600000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'projects',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '30',
            default: "'planning'",
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: "(datetime('now'))",
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: "(datetime('now'))",
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('projects');
  }
}

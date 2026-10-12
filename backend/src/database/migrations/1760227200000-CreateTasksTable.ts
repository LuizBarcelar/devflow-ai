
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateTasksTable1760227200000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'title',
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
            default: "'todo'",
          },
          {
            name: 'priority',
            type: 'varchar',
            length: '20',
            default: "'medium'",
          },
          {
            name: 'projectId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: "(datetime('now'))",
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: "(datetime('now'))",
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'tasks',
      new TableForeignKey({
        columnNames: ['projectId'],
        referencedTableName: 'projects',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'tasks',
      new TableIndex({
        name: 'IDX_tasks_projectId',
        columnNames: ['projectId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tasks', true);
  }
}

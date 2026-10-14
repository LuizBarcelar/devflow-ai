
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class AddProjectOwnership1791936000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const ownerId = process.env.LEGACY_PROJECT_OWNER_ID;

    if (!ownerId) {
      throw new Error(
        'Configure LEGACY_PROJECT_OWNER_ID antes da migration.',
      );
    }

    const users: Array<{ id: string }> = await queryRunner.query(
      'SELECT id FROM users WHERE id = ?',
      [ownerId],
    );

    if (users.length !== 1) {
      throw new Error(
        'O proprietário informado não existe no banco.',
      );
    }

    await queryRunner.addColumn(
      'projects',
      new TableColumn({
        name: 'userId',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.query(
      'UPDATE projects SET userId = ? WHERE userId IS NULL',
      [ownerId],
    );

    await queryRunner.changeColumn(
      'projects',
      'userId',
      new TableColumn({
        name: 'userId',
        type: 'varchar',
        isNullable: false,
      }),
    );

    await queryRunner.createIndex(
      'projects',
      new TableIndex({
        name: 'IDX_projects_userId',
        columnNames: ['userId'],
      }),
    );

    await queryRunner.createForeignKey(
      'projects',
      new TableForeignKey({
        name: 'FK_projects_userId',
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'projects',
      'FK_projects_userId',
    );

    await queryRunner.dropIndex(
      'projects',
      'IDX_projects_userId',
    );

    await queryRunner.dropColumn('projects', 'userId');
  }
}

import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class InitialTaskSchema1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TYPE \"task_status_enum\" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED')",
    );

    await queryRunner.createTable(
      new Table({
        name: 'task',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'owner_id', type: 'integer' },
          { name: 'title', type: 'varchar', length: '120' },
          { name: 'description', type: 'text', isNullable: true },
          {
            name: 'status',
            type: 'task_status_enum',
            default: "'PENDING'",
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'task',
      new TableIndex({
        name: 'IDX_task_owner_id',
        columnNames: ['owner_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('task');
    await queryRunner.query('DROP TYPE "task_status_enum"');
  }
}

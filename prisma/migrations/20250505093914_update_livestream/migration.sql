-- AlterTable
ALTER TABLE `LiveStream` ADD COLUMN `thumbnail_url` VARCHAR(255) NULL,
    ADD COLUMN `view_count` INTEGER NOT NULL DEFAULT 0;

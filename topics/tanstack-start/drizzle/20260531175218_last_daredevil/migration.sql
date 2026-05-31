CREATE TABLE `request_logs` (
	`id` text PRIMARY KEY,
	`method` text NOT NULL,
	`path` text NOT NULL,
	`status` integer NOT NULL,
	`duration_ms` integer NOT NULL,
	`created_at` text NOT NULL
);

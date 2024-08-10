CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`balance` integer DEFAULT 10000 NOT NULL,
	`text_modifiers` text DEFAULT '' NOT NULL,
	`int_modifiers` integer DEFAULT false NOT NULL
);

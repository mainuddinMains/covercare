CREATE TABLE `conversation` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text DEFAULT 'New conversation' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `insurance_profile` (
	`user_id` text PRIMARY KEY NOT NULL,
	`insurance_type` text DEFAULT '' NOT NULL,
	`plan_name` text DEFAULT '' NOT NULL,
	`member_id` text DEFAULT '' NOT NULL,
	`group_number` text DEFAULT '' NOT NULL,
	`insurer_phone` text DEFAULT '' NOT NULL,
	`effective_date` text DEFAULT '' NOT NULL,
	`city` text DEFAULT '' NOT NULL,
	`state` text DEFAULT '' NOT NULL,
	`state_code` text DEFAULT '' NOT NULL,
	`zip` text DEFAULT '' NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `message` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`role` text NOT NULL,
	`parts` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversation`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reminder` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider_name` text NOT NULL,
	`provider_address` text,
	`provider_phone` text,
	`appointment_date` text NOT NULL,
	`appointment_time` text NOT NULL,
	`reminder_minutes_before` integer NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`notified` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);

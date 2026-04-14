CREATE TABLE `mrf_rate_cache` (
	`id` text PRIMARY KEY NOT NULL,
	`insurer` text NOT NULL,
	`billing_code` text NOT NULL,
	`file_url` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`rate_min` real,
	`rate_max` real,
	`rate_median` real,
	`rate_avg` real,
	`sample_size` integer,
	`fetched_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `insurance_profile` ADD `issuer_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `insurance_profile` ADD `plan_type` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `insurance_profile` ADD `coverage_end_date` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `insurance_profile` ADD `annual_deductible` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `insurance_profile` ADD `copay_per_visit` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `insurance_profile` ADD `out_of_pocket_max` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `insurance_profile` ADD `monthly_premium` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `insurance_profile` ADD `pcp_name` text DEFAULT '' NOT NULL;
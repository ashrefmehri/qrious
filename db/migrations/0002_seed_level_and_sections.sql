-- The Bac level and its 7 sections (docs/01-product.md). Reference data every
-- environment needs, so it lives in a migration rather than in the content seed.
INSERT INTO "level" ("id", "name", "sort") VALUES
	('bac', '4ème année — Bac', 1)
ON CONFLICT ("id") DO NOTHING;--> statement-breakpoint
INSERT INTO "section" ("id", "name", "level_id", "sort") VALUES
	('maths', 'Mathématiques', 'bac', 1),
	('sciences-exp', 'Sciences expérimentales', 'bac', 2),
	('sciences-tech', 'Sciences techniques', 'bac', 3),
	('info', 'Sciences de l’informatique', 'bac', 4),
	('eco-gestion', 'Économie et gestion', 'bac', 5),
	('lettres', 'Lettres', 'bac', 6),
	('sport', 'Sport', 'bac', 7)
ON CONFLICT ("id") DO NOTHING;

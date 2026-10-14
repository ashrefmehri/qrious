// Database tables (docs/06-data-model.md). Migrations: `npm run db:generate`, then `npm run db:migrate`.

import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const timestamptz = (name: string) => timestamp(name, { withTimezone: true });

const timestamps = {
  createdAt: timestamptz("created_at").notNull().defaultNow(),
  updatedAt: timestamptz("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

// ---------------------------------------------------------------------------
// Better Auth: user, session, account, verification (its core schema, with uuid ids)

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Required by Better Auth; Qrious shows the pseudo from `profile` instead (Bienvenue, M3). */
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  /** Proof of consent, set when the sign-up checkboxes are ticked. Null for Google sign-ups until Bienvenue asks. */
  termsAcceptedAt: timestamptz("terms_accepted_at"),
  ageConfirmedAt: timestamptz("age_confirmed_at"),
  ...timestamps,
});

export const session = pgTable(
  "session",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    expiresAt: timestamptz("expires_at").notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamptz("access_token_expires_at"),
    refreshTokenExpiresAt: timestamptz("refresh_token_expires_at"),
    scope: text("scope"),
    /** Hashed by Better Auth; never read it elsewhere. */
    password: text("password"),
    ...timestamps,
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamptz("expires_at").notNull(),
    ...timestamps,
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ---------------------------------------------------------------------------
// Programme (read-only for students). Rows come from migrations and seeds.

export const level = pgTable("level", {
  /** e.g. "bac". */
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  sort: integer("sort").notNull(),
});

export const section = pgTable("section", {
  /** e.g. "maths", "sciences-exp". */
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  levelId: text("level_id")
    .notNull()
    .references(() => level.id),
  sort: integer("sort").notNull(),
});

// ---------------------------------------------------------------------------
// Students

export const themePreference = pgEnum("theme_preference", ["system", "light", "dark"]);

/**
 * Created when Bienvenue is finished, so a student has a profile exactly when
 * their pseudo and section are set (the /app gate relies on this).
 */
export const profile = pgTable(
  "profile",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    /** The only name other students ever see. Unique, ignoring case. */
    pseudo: text("pseudo").notNull(),
    sectionId: text("section_id")
      .notNull()
      .references(() => section.id),
    levelId: text("level_id")
      .notNull()
      .default("bac")
      .references(() => level.id),
    /** Optional, never shown to other students. */
    lycee: text("lycee"),
    theme: themePreference("theme").notNull().default("system"),
    showInLeaderboard: boolean("show_in_leaderboard").notNull().default(true),
    xpTotal: integer("xp_total").notNull().default(0),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("profile_pseudo_unique").on(sql`lower(${table.pseudo})`),
    index("profile_section_idx").on(table.sectionId),
  ],
);

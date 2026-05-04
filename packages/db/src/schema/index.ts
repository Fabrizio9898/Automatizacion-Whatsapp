import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const usuarios = pgTable("usuarios", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contactos = pgTable("contactos", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  nombre: text("nombre").notNull(),
  numero: text("numero").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const campaigns = pgTable("campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  message: text("message"),
  imageUrl: text("image_url"), // Aquí guardaremos la URL de UploadThing
  totalContacts: integer("total_contacts").default(0),
  cost: numeric("cost", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});
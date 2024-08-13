import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Users Table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  balance: integer("balance")
    .notNull()
    .default(10000),
});

// Movies Table
export const movies = sqliteTable("movies", {
  id: integer("id").primaryKey({ autoIncrement: true }),  
  title: text("title").notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull(),
  rating: integer("rating").notNull().default(0),
  releaseDate: text("release_date").notNull(),
  posterUrl: text("poster_url"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Theatres Table
export const theatres = sqliteTable("theatres", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  totalSeats: integer("total_seats").notNull(),
});

// Showtimes Table
export const showtimes = sqliteTable("showtimes", {
  id: integer("id").primaryKey({ autoIncrement: true }),  
  movieId: integer("movie_id").notNull().references(() => movies.id),
  theatreId: text("theatre_id").notNull().references(() => theatres.id),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  price: integer("price").notNull(),
});

// Seats Table
export const seats = sqliteTable("seats", {
  id: integer("id").primaryKey({ autoIncrement: true }),  
  showtimeId: integer("showtime_id").notNull().references(() => showtimes.id),
  seatNumber: text("seat_number").notNull(),
  isBooked: integer("is_booked").notNull().default(0),  // 0 for false, 1 for true
  userId: text("user_id").references(() => users.id),  // Nullable foreign key
});

// Ticket Purchases Table
export const ticketPurchases = sqliteTable("ticket_purchases", {
  id: integer("id").primaryKey({ autoIncrement: true }),  
  userId: text("user_id").notNull().references(() => users.id),
  showtimeId: integer("showtime_id").notNull().references(() => showtimes.id),
  seatId: integer("seat_id").notNull().references(() => seats.id),
  purchaseTime: text("purchase_time").notNull().default(sql`CURRENT_TIMESTAMP`),
  amountPaid: integer("amount_paid").notNull(),
});
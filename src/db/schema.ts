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
  director:text('director_id').references(() => users.id).notNull()
});

// Theatres Table
export const theatres = sqliteTable("theatres", {
  id: integer("id").primaryKey({autoIncrement:true}),
  name: text("name").notNull(),
  location: text("location").notNull(),
  totalSeats: integer("total_seats").notNull(),
  owner_id: text("owner_id").references(() => users.id).notNull() 
});

// Showtimes Table
export const showtimes = sqliteTable("showtimes", {
  id: integer("id").primaryKey({ autoIncrement: true }),  
  movieId: integer("movie_id").notNull().references(() => movies.id),
  theatreId: integer("theatre_id").notNull().references(() => theatres.id, { onDelete: "cascade" }), 
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  price: integer("price").notNull(),
  owner_id: text('owner_id').references(()=>users.id).notNull(),
});

// Seats Table
export const seats = sqliteTable("seats", {
  id: integer("id").primaryKey({ autoIncrement: true }),  
  parentTheatre: integer("parent_theatre").references(() => theatres.id, { onDelete: "cascade" }).notNull(),
  seatNumber: text("seat_number").notNull(),
});

// Ticket Purchases Table
export const ticketPurchases = sqliteTable("ticket_purchases", {
  id: integer("id").primaryKey({ autoIncrement: true }),  
  userId: text("user_id").notNull().references(() => users.id),
  showtimeId: integer("showtime_id").notNull().references(() => showtimes.id, { onDelete: "cascade" }),
  seatId: integer("seat_id").notNull().references(() => seats.id, { onDelete: "cascade" }), 
  purchaseTime: text("purchase_time").notNull().default(sql`CURRENT_TIMESTAMP`),
  amountPaid: integer("amount_paid").notNull(),
});

// Seat Bookings Table
export const seatBookings = sqliteTable("seat_bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  seatId: integer("seat_id").references(() => seats.id, { onDelete: "cascade" }).notNull(),
  showtimeId: integer("showtime_id").references(() => showtimes.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").references(() => users.id), // Assuming a user must book a seat
  isBooked: integer("is_booked").notNull().default(0),
});
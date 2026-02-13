import { VenueType } from "../schema.js";
// import { connectDb, disconnectDb } from "../conn.js";

export const seedVenueTypes = async () => {
  // await connectDb();

  const data = [
    {
      venue_type_code: "VT001",
      description: "GRAND HALL",
      description_info:
        "Weekends:December:Holidays;(Fri - Sun) (All day in Dec.)",
      rate: 140000,
      unit: "hour",
      unit_qty: 5,
      event_time_minimum: 5,
      vip_room_time_minimum: 5,
      ingress_time_minimum: 4,
      egress_time_minimum: 2,
      rank: 1,
    },
    {
      venue_type_code: "VT002",
      description: "GRAND HALL",
      description_info: "Weekdays;(Mon - Thurs)",
      rate: 100000,
      unit: "hour",
      unit_qty: 5,
      event_time_minimum: 5,
      vip_room_time_minimum: 5,
      ingress_time_minimum: 4,
      egress_time_minimum: 2,
      rank: 2,
    },
    {
      venue_type_code: "VT003",
      description: "HALF HALL (HALL A or B)",
      description_info: "Weekdays;(Mon - Thurs)",
      rate: 75000,
      unit: "hour",
      unit_qty: 4,
      event_time_minimum: 4,
      vip_room_time_minimum: 4,
      ingress_time_minimum: 3,
      egress_time_minimum: 1,
      rank: 3,
    },
  ];

  try {
    await VenueType.deleteMany({});
    await VenueType.insertMany(data);
    console.log("✅ Venue types seeded successfully");
  } catch (err) {
    console.error("❌ Error seeding venue types:", err);
  } finally {
    // disconnectDb();
  }
};

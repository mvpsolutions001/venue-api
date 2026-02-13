// import { connectDb, disconnectDb } from "../conn.js";
import { AddOptions } from "../schema.js";

export const seedAdditionalOptions = async () => {
  // await connectDb();

  const data = [
    {
      option_id: "AOPT0001",
      rank: 1,
      description: "Additional Hours Extension on Event Time",
      rate: 10000,
      unit: "hour",
      unit_qty: 1,
    },
    {
      option_id: "AOPT0002",
      rank: 2,
      description: "Additional Supplier s Ingress Time",
      rate: 2500,
      unit: "hour",
      unit_qty: 1,
    },
    {
      option_id: "AOPT0003",
      rank: 3,
      description: "Additional Supplier s Egress Time",
      rate: 2500,
      unit: "hour",
      unit_qty: 1,
    },
    {
      option_id: "AOPT0004",
      rank: 4,
      description: "Additional Rental Hours on VIP Rooms",
      rate: 2500,
      unit: "hour",
      unit_qty: 1,
    },
    {
      option_id: "AOPT0005",
      rank: 5,
      description:
        "THE GARDEN rental (Garden Ceremony or Dining) - Styling provided by others",
      rate: 25000,
      unit: "fixed",
      unit_qty: 1,
    },
    {
      option_id: "AOPT0006",
      rank: 6,
      description: "Upgrade to 100 amps electricity",
      rate: 10000,
      unit: "fixed",
      unit_qty: 1,
    },
    {
      option_id: "AOPT0007",
      rank: 7,
      description: "TC Stage Rental 12 x 16 x 2ft",
      rate: 8000,
      unit: "fixed",
      unit_qty: 1,
    },
    {
      option_id: "AOPT0008",
      rank: 8,
      description: "Scaffolding Rentals",
      rate: 5000,
      unit: "fixed",
      unit_qty: 1,
    },
    {
      option_id: "AOPT0009",
      rank: 9,
      description: "Pre-Nuptial Photoshoot (3 Hrs)",
      rate: 8000,
      unit: "fixed",
      unit_qty: 1,
    },
  ];

  try {
    await AddOptions.deleteMany({});
    await AddOptions.insertMany(data);
    console.log("✅  seeded successfully");
  } catch (err) {
    console.error("❌ Error seeding:", err);
  } finally {
    // disconnectDb();
  }
};

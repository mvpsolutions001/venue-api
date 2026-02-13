import { Corkages } from "../schema.js";
// import { connectDb, disconnectDb } from "../conn.js";

export const seedCorkageRates = async () => {
  // await connectDb();

  const data = [
    {
      option_id: "CR0001",
      rank: 1,
      description: "Non-accredited Caterer",
      rate: 30000,
      unit: "fixed",
      unit_qty: 1,
    },
    {
      option_id: "CR0002",
      rank: 2,
      description: "Non-accredited Lights and Sounds",
      rate: 15000,
      unit: "fixed",
      unit_qty: 1,
    },
  ];

  try {
    await Corkages.deleteMany({});
    await Corkages.insertMany(data);
    console.log("✅  Seeded successfully");
  } catch (err) {
    console.error("❌ Error seeding:", err);
  } finally {
    // disconnectDb();
  }
};

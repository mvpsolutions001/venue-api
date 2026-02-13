// import { connectDb, disconnectDb } from "../db/conn.js";
import { seedAdditionalOptions } from "../db/seeds/seed_add_options.js";
import { seedCorkageRates } from "../db/seeds/seed_corkages.js";
import { seedPaymentDetailsTerms } from "../db/seeds/seed_payment_terms.js";
import { seedVenueTypes } from "../db/seeds/seed_venue_type.js";

export const seedEvent = async (req, res) => {
  try {
    // await connectDb();
    await seedAdditionalOptions();
    await seedCorkageRates();
    await seedPaymentDetailsTerms();
    await seedVenueTypes();

    // await disconnectDb();

    res.json(true);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// import { connectDb, disconnectDb } from "../conn.js";
import { PaymentTerms } from "../schema.js";

export const seedPaymentDetailsTerms = async () => {
  // await connectDb();

  const data = [
    {
      term_code: "PDT001",
      rank: 1,
      description: "Earnest Money",
      schedule_description: "",
      pre_term_code: null,
      pre_term_unit: null,
      pre_term_period: 0,
    },
    {
      term_code: "PDT002",
      rank: 2,
      description: "Reservation",
      schedule_description: "Within 2 Weeks after Earnest",
      pre_term_code: "PDT001",
      pre_term_unit: "week",
      pre_term_period: 2,
    },
    {
      term_code: "PDT003",
      rank: 3,
      description: "50% Downpayment",
      schedule_description: "2 months after Reservation",
      pre_term_code: "PDT002",
      pre_term_unit: "month",
      pre_term_period: 2,
    },
    {
      term_code: "PDT004",
      rank: 4,
      description: "Full-Payment",
      schedule_description: "2 months before event date",
      pre_term_code: "event_date",
      pre_term_unit: "month",
      pre_term_period: 2,
    },
    {
      term_code: "PDT005",
      rank: 5,
      description: "Security Deposit",
      schedule_description: "2 months before event date",
      pre_term_code: "event_date",
      pre_term_unit: "month",
      pre_term_period: 2,
    },
    {
      term_code: "PDT006",
      rank: 6,
      description: "OTHERS",
      schedule_description: "",
      pre_term_code: null,
      pre_term_unit: null,
      pre_term_period: 0,
    },
  ];

  try {
    await PaymentTerms.deleteMany({});
    await PaymentTerms.insertMany(data);
    console.log("✅ Payment details terms seeded successfully");
  } catch (err) {
    console.error("❌ Error seeding payment details terms:", err);
  } finally {
    // await disconnectDb();
  }
};

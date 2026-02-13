// Optional filter
// {
//   $match: {
//     merchant_id: "0000001404114A546C5D" // <-- optional dynamic filter
//   }

import { generateTableName } from "./schema.js";

// },
const last6Months = [...Array(6).keys()]
  .map((i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label:
        d.toLocaleString("default", {
          month: "long",
        }) + ` (${d.getFullYear()})`,
    };
  })
  .reverse();

export const dashboardPipeline = (merchantId, role, merchantIds) => {
  let pipeline = [];

  if (merchantId && merchantId !== "default") {
    pipeline.push({
      $match: {
        merchant_id: merchantId,
      },
    });
  }
  if (
    merchantId &&
    merchantId === "default" &&
    ["merchant_manager", "user"].includes(role)
  ) {
    pipeline.push({
      $match: {
        merchant_id: null,
      },
    });
  }
  if (merchantId && merchantId === "default" && ["admin"].includes(role)) {
    pipeline.push({
      $match: {
        merchant_id: { $in: merchantIds },
      },
    });
  }

  /***********NEW*********** */
  pipeline.push({
    $addFields: {
      officeDatetimeAsDate: {
        $let: {
          vars: {
            dateParsed: {
              $switch: {
                branches: [
                  {
                    // Format: 2025-08-29 10:29:15
                    case: {
                      $regexMatch: {
                        input: "$office.datetime",
                        regex: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
                      },
                    },
                    then: {
                      $dateFromString: {
                        dateString: "$office.datetime",
                        format: "%Y-%m-%d %H:%M:%S",
                      },
                    },
                  },
                  {
                    // Format: SEP. 18, 2025
                    case: {
                      $regexMatch: {
                        input: "$office.datetime",
                        regex: /^[A-Z]{3}\. \d{1,2}, \d{4}$/,
                      },
                    },
                    then: {
                      $dateFromString: {
                        dateString: "$office.datetime",
                        format: "%b. %d, %Y",
                      },
                    },
                  },
                ],
                default: null,
              },
            },
          },
          in: {
            // If time component is missing (like SEP. 18, 2025), add time 00:00:00 explicitly
            $cond: {
              if: {
                // Check if the original string has time info (contains ':')
                $regexMatch: { input: "$office.datetime", regex: /:/ },
              },
              then: "$$dateParsed",
              else: {
                // Add 0 hours, 0 minutes, 0 seconds to the parsed date (just to be explicit)
                $dateAdd: {
                  startDate: "$$dateParsed",
                  unit: "hour",
                  amount: 0,
                },
              },
            },
          },
        },
      },
    },
  });
  /***********NEW*********** */

  // pipeline.push({
  //   $addFields: {
  //     officeDatetimeAsDate: {
  //       $dateFromString: {
  //         dateString: "$office.datetime",
  //         format: "%Y-%m-%d %H:%M:%S",
  //       },
  //     },
  //   },
  // });
  pipeline.push({
    $facet: {
      pchannelCounts: [
        {
          $group: {
            _id: "$pchannel",
            count: { $sum: 1 },
            totalAmount: { $sum: { $toDouble: "$amount_paid" } },
          },
        },
        { $sort: { totalAmount: -1 } },
      ],

      totals: [
        {
          $group: {
            _id: null,
            totalAmount: { $sum: { $toDouble: "$amount_paid" } },
            totalCount: { $sum: 1 },
          },
        },
      ],

      topMerchants: [
        {
          $group: {
            _id: "$merchant.id",
            merchantName: { $first: "$merchant.name" },
            count: { $sum: 1 },
            totalAmount: { $sum: { $toDouble: "$amount_paid" } },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ],

      monthlyActuals: [
        {
          $group: {
            _id: {
              year: { $year: "$officeDatetimeAsDate" },
              month: { $month: "$officeDatetimeAsDate" },
            },
            totalAmount: { $sum: { $toDouble: "$amount_paid" } },
            count: { $sum: 1 },
          },
        },
      ],
    },
  });
  pipeline.push({
    $addFields: {
      monthlySummary: {
        $map: {
          input: { $literal: last6Months },
          as: "m",
          in: {
            label: "$$m.label",
            year: "$$m.year",
            month: "$$m.month",
            totalAmount: {
              $let: {
                vars: {
                  match: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$monthlyActuals",
                          as: "actual",
                          cond: {
                            $and: [
                              { $eq: ["$$actual._id.year", "$$m.year"] },
                              { $eq: ["$$actual._id.month", "$$m.month"] },
                            ],
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: { $ifNull: ["$$match.totalAmount", 0] },
              },
            },
            count: {
              $let: {
                vars: {
                  match: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$monthlyActuals",
                          as: "actual",
                          cond: {
                            $and: [
                              { $eq: ["$$actual._id.year", "$$m.year"] },
                              { $eq: ["$$actual._id.month", "$$m.month"] },
                            ],
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: { $ifNull: ["$$match.count", 0] },
              },
            },
          },
        },
      },
    },
  });
  pipeline.push({
    $project: {
      pchannelCounts: 1,
      totalAmount: {
        $ifNull: [{ $arrayElemAt: ["$totals.totalAmount", 0] }, 0],
      },
      totalCount: {
        $ifNull: [{ $arrayElemAt: ["$totals.totalCount", 0] }, 0],
      },
      topMerchants: 1,
      monthlySummary: 1,
    },
  });
  return pipeline;
};

export const roleListPipeLine = [
  {
    $lookup: {
      from: generateTableName("role_matrixes"),
      localField: "code",
      foreignField: "role_code",
      as: "rmx",
    },
  },
  {
    $lookup: {
      from: generateTableName("role_items"),
      localField: "rmx.item_code",
      foreignField: "item_code",
      as: "itm",
    },
  },
  {
    $lookup: {
      from: generateTableName("role_modules"),
      localField: "itm.module_code",
      foreignField: "module_code",
      as: "modules",
    },
  },
  {
    $lookup: {
      from: generateTableName("role_submodules"),
      localField: "itm.submodule_code",
      foreignField: "submodule_code",
      as: "submodules",
    },
  },
  {
    $addFields: {
      matrix: {
        $map: {
          input: "$rmx",
          as: "r",
          in: {
            role_code: "$code",
            role_name: "$name",
            item_code: "$$r.item_code",
            is_active: "$$r.is_active",
            rank: {
              $first: {
                $map: {
                  input: {
                    $filter: {
                      input: "$itm",
                      as: "i",
                      cond: { $eq: ["$$i.item_code", "$$r.item_code"] },
                    },
                  },
                  as: "matched",
                  in: "$$matched.rank",
                },
              },
            },
            items: {
              $first: {
                $map: {
                  input: {
                    $filter: {
                      input: "$itm",
                      as: "i",
                      cond: { $eq: ["$$i.item_code", "$$r.item_code"] },
                    },
                  },
                  as: "matched",
                  in: "$$matched.description",
                },
              },
            },
            module: {
              $first: {
                $map: {
                  input: {
                    $filter: {
                      input: "$modules",
                      as: "m",
                      cond: {
                        $eq: [
                          "$$m.module_code",
                          {
                            $first: {
                              $map: {
                                input: {
                                  $filter: {
                                    input: "$itm",
                                    as: "i",
                                    cond: {
                                      $eq: ["$$i.item_code", "$$r.item_code"],
                                    },
                                  },
                                },
                                as: "mItem",
                                in: "$$mItem.module_code",
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                  as: "mod",
                  in: "$$mod.description",
                },
              },
            },
            sub_module: {
              $first: {
                $map: {
                  input: {
                    $filter: {
                      input: "$submodules",
                      as: "s",
                      cond: {
                        $eq: [
                          "$$s.submodule_code",
                          {
                            $first: {
                              $map: {
                                input: {
                                  $filter: {
                                    input: "$itm",
                                    as: "i",
                                    cond: {
                                      $eq: ["$$i.item_code", "$$r.item_code"],
                                    },
                                  },
                                },
                                as: "mItem",
                                in: "$$mItem.submodule_code",
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                  as: "sub",
                  in: "$$sub.description",
                },
              },
            },
          },
        },
      },
    },
  },
  {
    $set: {
      matrix: {
        $sortArray: {
          input: "$matrix",
          sortBy: { rank: 1 },
        },
      },
    },
  },
  {
    $project: {
      name: 1,
      matrix: 1,
    },
  },
];

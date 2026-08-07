export const STRUCTURES = [
  {
    organizationCode: "BRSOLUTIONS",

    unitTypes: [
      {
        code: "EXECUTIVE_OFFICE",
        nameEn: "Executive Office",
        shortNameEn: "Executive Office",
        sortOrder: 1,
      },
      {
        code: "DEPARTMENT",
        nameEn: "Department",
        shortNameEn: "Department",
        sortOrder: 2,
      },
      {
        code: "SECTION",
        nameEn: "Section",
        shortNameEn: "Section",
        sortOrder: 3,
        parentTypeCode: "DEPARTMENT",
      },
    ],

    units: [
      {
        code: "EXECUTIVE",
        nameEn: "Executive Office",
        shortNameEn: "Executive Office",
        sortOrder: 1,
        unitTypeCode: "EXECUTIVE_OFFICE",
      },

      {
        code: "TECHNOLOGY",
        nameEn: "Technology Department",
        shortNameEn: "Technology",
        sortOrder: 2,
        unitTypeCode: "DEPARTMENT",
      },
      {
        code: "SOFTWARE_DEVELOPMENT",
        nameEn: "Software Development Section",
        shortNameEn: "Software Development",
        sortOrder: 1,
        unitTypeCode: "SECTION",
        parentCode: "TECHNOLOGY",
      },
      {
        code: "INFRASTRUCTURE_OPERATIONS",
        nameEn: "Infrastructure & Operations Section",
        shortNameEn: "Infrastructure & Operations",
        sortOrder: 2,
        unitTypeCode: "SECTION",
        parentCode: "TECHNOLOGY",
      },
      {
        code: "QUALITY_ASSURANCE",
        nameEn: "Quality Assurance Section",
        shortNameEn: "Quality Assurance",
        sortOrder: 3,
        unitTypeCode: "SECTION",
        parentCode: "TECHNOLOGY",
      },

      {
        code: "FINANCE_ADMINISTRATION",
        nameEn: "Finance & Administration Department",
        shortNameEn: "Finance & Administration",
        sortOrder: 3,
        unitTypeCode: "DEPARTMENT",
      },
      {
        code: "FINANCE",
        nameEn: "Finance Section",
        shortNameEn: "Finance",
        sortOrder: 1,
        unitTypeCode: "SECTION",
        parentCode: "FINANCE_ADMINISTRATION",
      },
      {
        code: "HUMAN_RESOURCES",
        nameEn: "Human Resources Section",
        shortNameEn: "Human Resources",
        sortOrder: 2,
        unitTypeCode: "SECTION",
        parentCode: "FINANCE_ADMINISTRATION",
      },

      {
        code: "BUSINESS_DEVELOPMENT",
        nameEn: "Business Development Department",
        shortNameEn: "Business Development",
        sortOrder: 4,
        unitTypeCode: "DEPARTMENT",
      },
      {
        code: "SALES",
        nameEn: "Sales Section",
        shortNameEn: "Sales",
        sortOrder: 1,
        unitTypeCode: "SECTION",
        parentCode: "BUSINESS_DEVELOPMENT",
      },
      {
        code: "CLIENT_RELATIONS",
        nameEn: "Client Relations Section",
        shortNameEn: "Client Relations",
        sortOrder: 2,
        unitTypeCode: "SECTION",
        parentCode: "BUSINESS_DEVELOPMENT",
      },
    ],
  },

  {
    organizationCode: "NRB",

    unitTypes: [
      {
        code: "OFFICE",
        nameEn: "Office",
        shortNameEn: "Office",
        sortOrder: 1,
      },
      {
        code: "DEPARTMENT",
        nameEn: "Department",
        shortNameEn: "Department",
        sortOrder: 2,
      },
      {
        code: "DIVISION",
        nameEn: "Division",
        shortNameEn: "Division",
        sortOrder: 3,
        parentTypeCode: "DEPARTMENT",
      },
    ],

    units: [
      {
        code: "GOVERNOR_OFFICE",
        nameEn: "Governor's Office",
        shortNameEn: "Governor's Office",
        sortOrder: 1,
        unitTypeCode: "OFFICE",
      },

      {
        code: "MONETARY_MANAGEMENT",
        nameEn: "Monetary Management Department",
        shortNameEn: "Monetary Management",
        sortOrder: 2,
        unitTypeCode: "DEPARTMENT",
      },
      {
        code: "MONETARY_POLICY",
        nameEn: "Monetary Policy Division",
        shortNameEn: "Monetary Policy",
        sortOrder: 1,
        unitTypeCode: "DIVISION",
        parentCode: "MONETARY_MANAGEMENT",
      },
      {
        code: "RESEARCH",
        nameEn: "Research Division",
        shortNameEn: "Research",
        sortOrder: 2,
        unitTypeCode: "DIVISION",
        parentCode: "MONETARY_MANAGEMENT",
      },

      {
        code: "BANK_SUPERVISION",
        nameEn: "Bank Supervision Department",
        shortNameEn: "Bank Supervision",
        sortOrder: 3,
        unitTypeCode: "DEPARTMENT",
      },
      {
        code: "BANKING_SUPERVISION",
        nameEn: "Banking Supervision Division",
        shortNameEn: "Banking Supervision",
        sortOrder: 1,
        unitTypeCode: "DIVISION",
        parentCode: "BANK_SUPERVISION",
      },
      {
        code: "NBFI_SUPERVISION",
        nameEn: "Non-Bank Financial Institution Supervision Division",
        shortNameEn: "NBFI Supervision",
        sortOrder: 2,
        unitTypeCode: "DIVISION",
        parentCode: "BANK_SUPERVISION",
      },

      {
        code: "INFORMATION_TECHNOLOGY",
        nameEn: "Information Technology Department",
        shortNameEn: "Information Technology",
        sortOrder: 4,
        unitTypeCode: "DEPARTMENT",
      },
      {
        code: "APPLICATIONS",
        nameEn: "Applications Division",
        shortNameEn: "Applications",
        sortOrder: 1,
        unitTypeCode: "DIVISION",
        parentCode: "INFORMATION_TECHNOLOGY",
      },
      {
        code: "INFRASTRUCTURE",
        nameEn: "Infrastructure Division",
        shortNameEn: "Infrastructure",
        sortOrder: 2,
        unitTypeCode: "DIVISION",
        parentCode: "INFORMATION_TECHNOLOGY",
      },

      {
        code: "HUMAN_RESOURCES_MANAGEMENT",
        nameEn: "Human Resources Management Department",
        shortNameEn: "Human Resources Management",
        sortOrder: 5,
        unitTypeCode: "DEPARTMENT",
      },
      {
        code: "HUMAN_RESOURCES_DIVISION",
        nameEn: "Human Resources Division",
        shortNameEn: "Human Resources",
        sortOrder: 1,
        unitTypeCode: "DIVISION",
        parentCode: "HUMAN_RESOURCES_MANAGEMENT",
      },
      {
        code: "TRAINING",
        nameEn: "Training Division",
        shortNameEn: "Training",
        sortOrder: 2,
        unitTypeCode: "DIVISION",
        parentCode: "HUMAN_RESOURCES_MANAGEMENT",
      },
    ],
  },
];

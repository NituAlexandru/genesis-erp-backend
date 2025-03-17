import connectDB from "./src/config/db.js";
import Role from "./src/modules/roles/roleModel.js";

const seedRoles = async () => {
  await connectDB();

  const standardRoles = [
    {
      name: "Agent Vanzari",
      permissions: [
        "VIEW_CLIENTS",
        "VIEW_PRICES",
        "VIEW_ORDERS",
        "VIEW_RECEPTIONS",
        "CREATE_ORDERS",
        "CREATE_CLIENTS",
        "DELETE_MY_ORDERS",
      ],
      description: "Rolul implicit pentru agenții de vânzări.",
    },
    {
      name: "Operator Logistica",
      permissions: ["RECEIVE_STOCK", "LOAD_TRUCKS"],
      description: "Se ocupă de recepția și manipularea mărfii.",
    },
    {
      name: "Contabil",
      permissions: [
        "CREATE_INVOICE",
        "CREATE_NIR",
        "CREATE_AVIZ",
        "CREATE_STORNO",
        "CREATE_RECEPTIONS",
        "VIEW_CLIENTS",
        "VIEW_PRICES",
        "VIEW_ORDERS",
        "VIEW_RECEPTIONS",
        "CREATE_ORDERS",
        "CREATE_CLIENTS",
        "DELETE_MY_ORDERS",
      ],
      description: "Realizează facturi, avize și NIR.",
    },
    {
      name: "Sofer",
      permissions: ["VIEW_DELIVERY", "UPDATE_DELIVERY_STATUS"],
      description: "Accesează doar datele livrărilor alocate.",
    },
    {
      name: "Admin",
      permissions: [
        "CREATE_INVOICE",
        "CREATE_NIR",
        "CREATE_AVIZ",
        "CREATE_STORNO",
        "CREATE_RECEPTIONS",
        "VIEW_CLIENTS",
        "VIEW_PRICES",
        "VIEW_ORDERS",
        "VIEW_RECEPTIONS",
        "CREATE_ORDERS",
        "CREATE_CLIENTS",
        "DELETE_MY_ORDERS",
        "MANAGE_USERS",
        "MANAGE_ROLES",
        "VIEW_ALL_PAGES",
      ],
      description:
        "Manageriază aplicația, fără statistici avansate utilizatori.",
    },
    {
      name: "Administrator",
      permissions: [
        "CREATE_INVOICE",
        "CREATE_NIR",
        "CREATE_AVIZ",
        "CREATE_STORNO",
        "CREATE_RECEPTIONS",
        "VIEW_CLIENTS",
        "VIEW_PRICES",
        "VIEW_ORDERS",
        "VIEW_RECEPTIONS",
        "CREATE_ORDERS",
        "CREATE_CLIENTS",
        "DELETE_MY_ORDERS",
        "MANAGE_USERS",
        "MANAGE_ROLES",
        "VIEW_ALL_PAGES",
        "VIEW_USER_STATISTICS",
      ],
      description:
        "Rol administrator, cu acces la statistici utilizatori și tot restul.",
    },
  ];

  for (const r of standardRoles) {
    const existing = await Role.findOne({ name: r.name });
    if (!existing) {
      await Role.create(r);
      console.log(`Created role: ${r.name}`);
    } else {
      console.log(`Role ${r.name} already exists.`);
    }
  }

  process.exit();
};

seedRoles();

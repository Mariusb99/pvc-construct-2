import type {
  categories,
  brands,
  equipment,
  equipmentImages,
  equipmentSpecifications,
  specTemplates,
  leads,
  rentals,
  availabilityBlocks,
  users,
  settings,
} from "./schema";

export type Category = typeof categories.$inferSelect;
export type Brand = typeof brands.$inferSelect;
export type Equipment = typeof equipment.$inferSelect;
export type EquipmentImage = typeof equipmentImages.$inferSelect;
export type EquipmentSpecification = typeof equipmentSpecifications.$inferSelect;
export type SpecTemplate = typeof specTemplates.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type Rental = typeof rentals.$inferSelect;
export type AvailabilityBlock = typeof availabilityBlocks.$inferSelect;
export type User = typeof users.$inferSelect;
export type Settings = typeof settings.$inferSelect;

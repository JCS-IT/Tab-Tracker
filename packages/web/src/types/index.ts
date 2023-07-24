import type { VDataTable } from "vuetify/labs/VDataTable";

export type VDataTableHeaderProps = Extract<
  VDataTable["$props"]["headers"],
  { key: string }
>;

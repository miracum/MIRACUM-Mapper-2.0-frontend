export const on_item_select_autocomplete = (value: any, data: any, roleId: number) => {
  data[`code_${roleId}`] = value.code
  data[`meaning_${roleId}`] = value.meaning
  data[`id_${roleId}`] = value.id
}

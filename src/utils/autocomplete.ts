export const on_item_select_autocomplete = (value: any, data: any, roleId: number) => {
  data[`code_${roleId}`] = value.code
  data[`meaning_${roleId}`] = value.meaning
  data[`id_${roleId}`] = value.id
  data[`status_${roleId}`] = value.status
}

export const validateFields = (data:any, roleId: number) => {
  if (!data[`code_${roleId}`] || !data[`meaning_${roleId}`]) {
      data[`code_${roleId}`] = '';
      data[`meaning_${roleId}`] = '';
      data[`id_${roleId}`] = null;
      data[`status_${roleId}`] = '';
  }
};

<template>
  <tr :class="{ 'data-table-row--editable': editMode }">
    <td v-for="column in columns" :key="column.name">
      <template v-if="editMode">
        <input type="text" v-model="rowData[column.name]" />
      </template>

      <template v-else>{{ row[column.name] }}</template>
    </td>

    <td style="padding: 2px">
      <template v-if="editMode">
        <button @click="onClickSave" title="Сохранить"><icon-check /></button>
        <button @click="onClickCancel" title="Отменить"><icon-cancel /></button>
      </template>
      <template v-else>
        <button @click="onClickEdit" title="Изменить"><icon-edit /></button>
        <button @click="onClickDelete" title="Удалить"><icon-trash /></button>
      </template>
    </td>
  </tr>
</template>

<script>
import IconEdit from "@/assets/icons/IconEdit";
import IconTrash from "@/assets/icons/IconTrash";
import IconCancel from "@/assets/icons/IconCancel";
import IconCheck from "@/assets/icons/IconCheck";

export default {
  name: "DataTableRow",
  components: {
    IconEdit,
    IconTrash,
    IconCancel,
    IconCheck,
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
      required: true,
    },
    row: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    addMode: {
      type: Boolean,
      default: false,
    },
    /* определяют текст для диалоговых окон */
    prefixForEntityDialog: {
      type: String,
      default: "запись",
    },
    columnNameForEntityDialog: {
      type: String,
      default: "name",
    },
  },
  emits: ["row:cancel", "row:save", "row:delete"],
  data() {
    return {
      editMode: this.addMode,
      rowData: this.row,
    };
  },
  methods: {
    onClickEdit() {
      this.editMode = true;
    },
    onClickDelete() {
      const textDialog = `Удалить ${this.prefixForEntityDialog} "${
        this.rowData[this.columnNameForEntityDialog]
      }"?`;
      if (confirm(textDialog)) {
        this.$emit("row:delete");
      }
    },
    onClickSave() {
      this.$emit("row:save", this.rowData);
      this.editMode = false;
    },
    onClickCancel() {
      this.$emit("row:cancel");
      this.editMode = false;
    },
  },
};
</script>

<style lang="scss">
.data-table-row--editable {
  td {
    background-color: #f0f0f0;
  }
}
</style>

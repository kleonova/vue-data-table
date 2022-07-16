<template>
  <tr
    class="data-table__row"
    :class="{ 'data-table__row--editable': editMode }"
  >
    <td v-for="column in columns" :key="column.name">
      <template v-if="editMode">
        <input type="text" v-model="rowData[column.name]" />
      </template>

      <template v-else>{{ row[column.name] }}</template>
    </td>

    <td>
      <template v-if="editMode">
        <button @click="onClickSave">save</button>
        <button @click="onClickCancel">cancel</button>
      </template>
      <template v-else>
        <button @click="onClickEdit">edit</button>
        <button @click="onClickDelete">del</button>
      </template>
    </td>
  </tr>
</template>

<script>
export default {
  name: "DataTableRow",
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
      if (confirm("Удалить?") == true) {
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
.data-table__row--editable {
  td {
    background-color: aquamarine;
  }
}
</style>

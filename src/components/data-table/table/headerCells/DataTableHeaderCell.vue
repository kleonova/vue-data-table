<template>
  <div class="data-table-header-cell">
    <div class="data-table-header-cell__sort" @click="onClickSort">
      {{ column.label }} | {{ sortIcon }}
    </div>
    resize
  </div>
</template>

<script>
export default {
  name: "DataTableHeaderCell",
  props: {
    column: {
      type: Object,
      required: true,
    },
    sortColumn: {
      type: String,
      default: "",
    },
    sortOrder: {
      type: String,
      default: "asc",
      validator(value) {
        return ["asc", "desc"].includes(value);
      },
    },
  },
  emits: ["sort:change"],
  computed: {
    sortIcon() {
      return this.column.name === this.sortColumn
        ? this.sortOrder === "desc"
          ? "desc"
          : "asc"
        : "none";
    },
  },
  methods: {
    onClickSort() {
      const newSortColumn = this.column.name;
      const newSortOrder =
        this.column.name === this.sortColumn
          ? this.sortOrder === "desc"
            ? "asc"
            : "desc"
          : "asc";

      this.$emit("sort:change", newSortColumn, newSortOrder);
    },
  },
};
</script>

<style lang="scss" scoped>
.data-table-header-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: normal;

  &__sort {
    cursor: pointer;
  }
}
</style>

<template>
  <div class="data-table-header-cell">
    <div class="data-table-header-cell__sort" @click="onClickSort">
      <span>{{ column.label }}</span>
      <icon-sort :asc="showAsc" :desc="showDesc" class="m-l-5" />
    </div>
    resize
  </div>
</template>

<script>
import IconSort from "@/assets/icons/IconSort";

export default {
  name: "DataTableHeaderCell",
  components: {
    IconSort,
  },
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
    showAsc() {
      return this.column.name === this.sortColumn && this.sortOrder === "asc";
    },
    showDesc() {
      return this.column.name === this.sortColumn && this.sortOrder === "desc";
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
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
</style>

<template>
  <div class="data-table-header-cell">
    <div class="data-table-header-cell__title" @click="onClickSort">
      <span>{{ column.label }}</span>
      <icon-sort :asc="showAsc" :desc="showDesc" class="m-l-5" />
    </div>

    <div class="data-table-header-cell__resize" @mousedown="handlerMouseDown">
      &nbsp;
    </div>
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
  emits: ["sort:change", "size:change"],
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

    /* */
    /* */
    handlerMouseDown(e) {
      document.addEventListener("mousemove", this.handlerMouseMove);
      document.addEventListener("mouseup", this.handlerMouseUp);

      this.resizedColumn = e.target.parentElement;
      this.startResizePosition = e.pageX;
      this.startWidthColumn = this.resizedColumn.offsetWidth;
    },
    handlerMouseUp() {
      if (this.resizedColumn) {
        document.removeEventListener("mousemove", this.handlerMouseMove);
        document.removeEventListener("mouseup", this.handlerMouseUp);

        this.resizedColumn = null;
      }
    },
    handlerMouseMove(e) {
      if (this.resizedColumn) {
        const different = e.pageX - this.startResizePosition;
        const newWidth = Math.max(30, this.startWidthColumn + different);
        this.$emit("size:change", this.column, newWidth);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.data-table-header-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;

  &:hover .data-table-header-cell__resize {
    background-color: lightgray;
  }

  &__title {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 5px 3px;
  }

  &__resize {
    display: block;
    margin-right: 1px;
    width: 4px;
    height: 28px;
    cursor: col-resize;
  }
}
</style>

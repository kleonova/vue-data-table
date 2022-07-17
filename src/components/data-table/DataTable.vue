<template>
  <div class="data-table-wrapper">
    <div class="d-flex">
      <data-table-filter
        v-if="showFilter"
        class="flex-grow"
        @search:change="onSearchChange"
        @search:clear="onSearchClear"
      />

      <button @click="showSettings = !showSettings" class="m-l-10">
        Настройки
      </button>
    </div>

    <div class="m-t-5 m-b-5" v-if="showSettings">
      <h3>Настройка столбцов</h3>

      <div class="d-flex">
        <div v-for="column in columns" :key="column.name" class="m-r-10">
          <label>
            <input
              type="checkbox"
              :checked="!column.hide"
              :disabled="column.required"
              @click="changeVisibleColumn(column)"
            />

            {{ column.name }}
          </label>
        </div>
      </div>
    </div>

    <table :id="tableId" class="data-table m-t-5">
      <thead>
        <tr>
          <th v-for="column in visibleColumns" :key="column.name">
            <data-table-header-cell
              :column="column"
              :sort-column="sort.column"
              :sort-order="sort.order"
              @sort:change="onChangeSort"
              @size:change="handlerChangeSizeColumn"
            />
          </th>

          <th v-if="editable">
            <button
              v-if="!showFormAdd"
              @click="showFormAdd = true"
              title="Добавить"
            >
              <icon-plus />
            </button>
          </th>
        </tr>
      </thead>

      <tbody>
        <data-table-row
          v-if="showFormAdd"
          :columns="visibleColumns"
          :row="newItem"
          editable
          add-mode
          @row:cancel="showFormAdd = false"
          @row:save="onCreateRow"
        />

        <data-table-row
          v-for="row in filterRows"
          v-bind="{
            editable,
            prefixForEntityDialog,
            columnNameForEntityDialog,
          }"
          :key="row.id"
          :row="row"
          :columns="visibleColumns"
          @row:delete="onDeleteRow(row.id)"
          @row:save="onUpdateRow"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import DataTableFilter from "@/components/data-table/filter/DataTableFilter";
import DataTableHeaderCell from "@/components/data-table/table/headerCells/DataTableHeaderCell";
import DataTableRow from "@/components/data-table/table/rows/DataTableRow";
import IconPlus from "@/assets/icons/IconPlus";
import { compareByOrder } from "@/utils/sortArray";

export default {
  name: "DataTable",
  components: {
    DataTableFilter,
    DataTableHeaderCell,
    DataTableRow,
    IconPlus,
  },
  props: {
    tableId: {
      type: String,
      required: true,
    },
    /* описание вывода и корректировки */
    tableConstructor: {
      type: Array,
      required: true,
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    dataUrl: {
      type: [String, Boolean],
      default: false,
    },
    /* определяет будет ли при изменении фильтра или сортировки уходить запрос на перепостроение данных */
    serverRender: {
      type: Boolean,
      default: false,
    },
    defaultSort: {
      type: Object,
      default: () => ({
        column: "id",
        order: "asc",
      }),
    },
    editable: {
      type: Boolean,
      default: false,
    },
    showFilter: {
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
  emits: ["row:create", "row:update", "row:delete"],
  data() {
    return {
      /* base */
      columns: [...this.tableConstructor],
      rows: [],

      /* sort */
      sort: this.defaultSort,

      /* filter */
      filter: null,

      /* crud */
      showFormAdd: false,
      newItem: {},

      /* settings */
      showSettings: false,
    };
  },
  computed: {
    filterRows() {
      if (!this.filter) return this.rows;

      return this.rows.filter((item) => {
        // Object.values(item).forEach((value) => value.includes(searchValue));
        return item.name.toLowerCase().includes(this.filter);
      });
    },
    visibleColumns() {
      return this.columns.filter(({ hide }) => {
        return !hide;
      });
    },
  },
  mounted() {
    /* sort */
    this.getLocalStorageSort();

    /* init */
    this.constructTable();
    this.getLocalStorageHideColumnSettings();
    this.getLocalStorageColumnsSize();
    this.setTableSize();
    this.initNewItem();
  },
  methods: {
    /* */
    constructTable() {
      if (this.dataUrl) {
        console.log("todo get data with sort");
      } else {
        // sortData
        this.rows = this.tableData;
        this.localSortData();
      }
    },

    /* for grid */
    setTableSize() {
      const tableElement = document.getElementById(this.tableId);

      let tableGridStyle = this.visibleColumns
        .map(({ size, minSize = 50, maxFrame = 1 }) => {
          return size ? `${size}px` : `minmax(${minSize}px, ${maxFrame}fr)`;
        })
        .join(" ");

      if (this.editable) {
        tableGridStyle += " 72px";
      }

      tableElement.style.gridTemplateColumns = tableGridStyle;
    },
    handlerChangeSizeColumn(column, newWidth) {
      column.size = newWidth;
      this.setTableSize();
      this.setLocalStorageColumnsSize();
    },
    getLocalStorageColumnsSize() {
      const nameLocalStorage = this.tableId + "-size-columns";
      const sizeColumnSettings = JSON.parse(
        localStorage.getItem(nameLocalStorage)
      );

      if (sizeColumnSettings) {
        Object.entries(sizeColumnSettings).forEach(([key, value]) => {
          const column = this.columns.find(({ name }) => {
            return name === key;
          });
          column.size = value;
        });
      }
    },
    setLocalStorageColumnsSize() {
      const nameLocalStorage = this.tableId + "-size-columns";
      const sizeColumnSettings = {};

      this.columns.forEach(({ name, size }) => {
        sizeColumnSettings[name] = size;
      });
      //
      localStorage.setItem(
        nameLocalStorage,
        JSON.stringify(sizeColumnSettings)
      );
    },

    /* for settings */
    getLocalStorageHideColumnSettings() {
      const nameLocalStorage = this.tableId + "-hide-columns";
      const hideColumnSettings = JSON.parse(
        localStorage.getItem(nameLocalStorage)
      );

      if (hideColumnSettings) {
        Object.entries(hideColumnSettings).forEach(([key, value]) => {
          const column = this.columns.find(({ name }) => {
            return name === key;
          });
          column.hide = value;
        });
      }
    },
    setLocalStorageHideColumnSettings() {
      const nameLocalStorage = this.tableId + "-hide-columns";
      const hideColumnSettings = {};
      //
      this.columns.forEach(({ name, hide }) => {
        hideColumnSettings[name] = hide;
      });
      //
      localStorage.setItem(
        nameLocalStorage,
        JSON.stringify(hideColumnSettings)
      );
    },
    changeVisibleColumn(column) {
      if (!column.required) {
        column.hide = !column.hide;
        this.setTableSize();
        this.setLocalStorageHideColumnSettings();
      }
    },

    /* for sort */
    getLocalStorageSort() {
      const nameLocalStorage = this.tableId + "-sort";
      const sortSettings = JSON.parse(localStorage.getItem(nameLocalStorage));

      if (sortSettings) {
        this.sort = {
          column: sortSettings.column,
          order: sortSettings.order,
        };
      }
    },
    setLocalStorageSort() {
      const nameLocalStorage = this.tableId + "-sort";
      localStorage.setItem(nameLocalStorage, JSON.stringify(this.sort));
    },
    onChangeSort(newSortColumn, newSortOrder) {
      this.sort = {
        column: newSortColumn,
        order: newSortOrder,
      };

      this.setLocalStorageSort();

      if (this.serverRender) {
        console.log("get new data");
      } else {
        this.localSortData();
      }
    },
    localSortData() {
      const column = this.sort.column;
      const order = this.sort.order;

      const sortFunction = function (a, b) {
        return compareByOrder(a[column], b[column], order);
      };
      this.rows.sort(sortFunction);
    },

    /* for filter */
    onSearchChange(searchValue) {
      if (this.serverRender) {
        console.log("get new data");
      } else {
        this.filter = searchValue.toLowerCase();
      }
    },
    onSearchClear() {
      this.filter = "";
    },

    /* for crud  */
    initNewItem() {
      this.tableConstructor.forEach((prop) => {
        this.newItem[prop.name] = "";
      });
    },
    onCreateRow(newData) {
      this.$emit("row:create", newData);
      this.rows.unshift(newData);
      this.showFormAdd = false;
      this.newItem = {};
    },
    onUpdateRow(newData) {
      this.$emit("row:update", newData);
      let rowItem = this.rows.find(({ id }) => {
        return id === newData.id;
      });
      if (!this.serverRender) {
        if (rowItem) {
          rowItem = { ...newData };
        }
      }
    },
    onDeleteRow(rowId) {
      this.$emit("row:delete", rowId);
      if (!this.serverRender) {
        this.rows = this.rows.filter(({ id }) => {
          return id !== rowId;
        });
      }
    },
  },
};
</script>

<style lang="scss">
.data-table-wrapper {
  display: flex;
  flex-direction: column;
}

.data-table {
  display: grid;
  border-collapse: collapse;
  min-width: 100%;

  thead,
  tbody,
  tr {
    display: contents;
  }

  th,
  td {
    border-collapse: collapse;
    border-bottom: 1px solid #cccccc;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  td {
    padding: 8px 3px 5px;
  }

  button {
    background-color: inherit;
    border: none;
    padding: 2px;
    cursor: pointer;
    width: 24px;
    height: 24px;
    color: #606060;
  }

  input {
    background-color: inherit;
    outline: none;
    border: none;
    border-bottom: 1px transparent;
    width: 100%;

    &:focus {
      border-bottom: 1px dashed;
    }
  }
}
</style>

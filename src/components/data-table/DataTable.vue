<template>
  <div class="data-table-wrapper">
    <data-table-filter
      @search:change="onSearchChange"
      @search:clear="onSearchClear"
    />

    <table :id="tableId" class="data-table m-t-5">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.name">
            <data-table-header-cell
              :column="column"
              :sort-column="sort.column"
              :sort-order="sort.order"
              @sort:change="onChangeSort"
              @size:change="handlerChangeSizeColumn"
            />
          </th>

          <th v-if="editable">
            <button v-if="!showFormAdd" @click="showFormAdd = true">add</button>
          </th>
        </tr>
      </thead>

      <tbody>
        <data-table-row
          v-if="showFormAdd"
          :columns="columns"
          :row="newItem"
          editable
          add-mode
          @row:cancel="showFormAdd = false"
          @row:save="onCreateRow"
        />

        <data-table-row
          v-for="row in filterRows"
          :key="row['id']"
          :row="row"
          :columns="columns"
          :editable="editable"
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
import { compareByOrder } from "@/utils/sortArray";
import DataTableRow from "@/components/data-table/table/rows/DataTableRow";

export default {
  name: "DataTable",
  components: {
    DataTableFilter,
    DataTableHeaderCell,
    DataTableRow,
  },
  props: {
    tableId: {
      type: String,
      required: true,
    },
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
  },
  emits: ["row:create", "row:update", "row:delete"],
  data() {
    return {
      /* init */
      columns: [],
      rows: [],

      /* sort */
      sort: this.defaultSort,

      /* filter */
      filter: null,

      /* crud */
      showFormAdd: false,
      newItem: {},
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
  },
  mounted() {
    /* sort */
    this.getLocalStorageSort();

    /* init */
    this.constructTable();
    this.setTableSize();
    this.initNewItem();
  },
  methods: {
    /* */
    constructTable() {
      this.columns = this.tableConstructor.filter(({ hide }) => {
        return !hide;
      });

      if (this.dataUrl) {
        console.log("todo get data with sort");
      } else {
        // sortData
        this.rows = this.tableData;
        this.localSortData();
      }
    },

    /* grid */
    setTableSize() {
      const tableElement = document.getElementById(this.tableId);

      let tableGridStyle = this.columns
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
    padding: 5px 3px;
  }
}
</style>

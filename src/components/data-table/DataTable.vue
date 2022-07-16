<template>
  <div class="data-table-wrapper">
    <data-table-filter
      @search:change="onSearchChange"
      @search:clear="onSearchClear"
    />

    <table :id="tableId" class="data-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.name">
            <data-table-header-cell
              :column="column"
              :sort-column="sort.column"
              :sort-order="sort.order"
              @sort:change="onChangeSort"
            />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in filterRows" :key="row['id']">
          <td v-for="column in columns" :key="column.name">
            {{ row[column.name] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import DataTableFilter from "@/components/data-table/filter/DataTableFilter";
import DataTableHeaderCell from "@/components/data-table/table/headerCells/DataTableHeaderCell";
import { compareByOrder } from "@/utils/sortArray";

export default {
  name: "DataTable",
  components: {
    DataTableFilter,
    DataTableHeaderCell,
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
  },
  emits: [],
  data() {
    return {
      /* init */
      columns: [],
      rows: [],

      /* sort */
      sort: this.defaultSort,

      /* filter */
      filter: null,
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
  methods: {
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

    /* filter */
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
  },
};
</script>

<style lang="scss" scoped>
.data-table-wrapper {
  display: flex;
  flex-direction: column;
}

.data-table {
  font-size: 13px;
  text-align: left;
}

th,
td {
  border: 1px solid;
}
</style>

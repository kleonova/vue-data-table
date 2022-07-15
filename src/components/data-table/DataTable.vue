<template>
  <div class="data-table-wrapper">
    <data-table-filter />

    <table>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.name">
            {{ column.label }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in rows" :key="row['id']">
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

export default {
  name: "DataTable",
  components: {
    DataTableFilter,
  },
  props: {
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
  },
  emits: [],
  setup() {},
  data() {
    return {
      /* init */
      columns: [],
      rows: [],
    };
  },
  computed: {},
  mounted() {
    /* init */
    this.columns = this.tableConstructor.filter(({ hide }) => {
      return !hide;
    });

    if (this.dataUrl) {
      console.log("todo get data");
    } else {
      this.rows = this.tableData;
    }
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.data-table-wrapper {
  display: flex;
  flex-direction: column;
}
</style>

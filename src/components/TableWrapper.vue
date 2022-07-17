<template>
  <div v-if="isLoading">
    <data-table
      :table-id="tableId"
      :table-constructor="tableConstructor"
      :table-data="cats"
      editable
    />
  </div>
</template>

<script>
import catApi from "@/services/cats.api";
import DataTable from "@/components/data-table/DataTable";

export default {
  name: "TableWrapper",
  components: {
    DataTable,
  },
  data() {
    return {
      isLoading: false,
      tableId: "table-cats",
      tableConstructor: [
        {
          name: "id",
          label: "id",
          hide: false,
          required: true,
          size: 60,
        },
        {
          name: "name",
          label: "name",
          hide: false,
          required: true,
          minSize: 100,
        },
        {
          name: "temperament",
          label: "temperament",
          hide: true,
          maxFrame: 2,
        },
        {
          name: "origin",
          label: "origin",
          hide: false,
        },
        {
          name: "country_code",
          label: "country_code",
          hide: false,
          size: 131,
        },
        {
          name: "description",
          label: "description",
          hide: true,
        },
        {
          name: "life_span",
          label: "life_span",
          hide: false,
        },
        {
          name: "indoor",
          label: "indoor",
          hide: false,
          size: 74,
        },
        {
          name: "lap",
          label: "lap",
          hide: false,
          size: 74,
        },
        {
          name: "alt_names",
          label: "alt_names",
          hide: false,
          maxFrame: 2,
        },
      ],
      defaultSort: {
        column: "id",
        order: "asc",
      },
      defaultFilter: {},
      cats: [],
    };
  },
  mounted() {
    catApi
      .getBreeds()
      .then((response) => {
        this.cats = response.data;
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        this.isLoading = true;
      });
  },
};
</script>

<style scoped></style>

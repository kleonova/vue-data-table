<template>
  <div class="data-table-filter">
    <div>
      <input v-model="search" type="text" placeholder="Поиск..." />
    </div>
    <button @click="onSearch">Найти</button>
    <button v-if="search" @click="onClear">Очистить</button>
  </div>
</template>

<script>
export default {
  name: "DataTableFilter",
  props: {},
  emits: ["search:change", "search:clear"],
  data() {
    return {
      search: null,
    };
  },
  computed: {},
  mounted() {},
  methods: {
    onSearch() {
      if (this.search) {
        this.$emit("search:change", this.search);
      }
    },
    onClear() {
      this.search = null;
      this.$emit("search:clear");
    },
  },
};
</script>

<style lang="scss" scoped>
.data-table-filter {
  display: flex;
}
</style>

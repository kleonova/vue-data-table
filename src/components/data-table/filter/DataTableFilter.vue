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
  mounted() {
    this.getFilterState();
    this.onSearch();
  },
  methods: {
    setFilterState() {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?search=${this.search}`
      );
    },
    getFilterState() {
      const windowData = Object.fromEntries(
        new URL(window.location).searchParams.entries()
      );

      const VALID_KEYS = ["search"];
      VALID_KEYS.forEach((key) => {
        if (windowData[key]) {
          this[key] = windowData[key];
        }
      });
    },
    onSearch() {
      if (this.search) {
        this.setFilterState();
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

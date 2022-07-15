<template>
  <div class="data-table-filter">
    <div>
      <input type="text" placeholder="Поиск..." />
    </div>
    <button>Найти</button>
  </div>
</template>

<script>
export default {
  name: "DataTableFilter",
};
</script>

<style lang="scss" scoped>
.data-table-filter {
  display: flex;
}
</style>

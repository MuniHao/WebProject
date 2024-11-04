<script setup>
defineProps({
  products: { type: Array, default: () => [] },
  selectedIndex: { type: Number, default: -1 },
});

const $emit = defineEmits(['update:selectedIndex']);
</script>

<template>
  <ul class="list-group">
    <li
      class="list-group-item px-3"
      v-for="(product, index) in products"
      :class="{ active: index === selectedIndex }"
      :key="product.product_id"
      @click="$emit('update:selectedIndex', index)"
    >
      {{ product.product_name }}
    </li>
  </ul>
</template>

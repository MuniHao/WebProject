<script setup>
defineProps({
  product: { type: Object, required: true },
});
</script>

<template>
  <div>
    <div class="p-1 w-75 h-75">
      <img class="img-fluid img-thumbnail" :src="product.product_image" alt="" />
    </div>
    <div class="p-1">
      <strong>Tên Sản phẩm:</strong> {{ product.product_name }}
    </div>
    <div class="p-1">
      <strong>Màu sắc:</strong> {{ product.product_color }}
    </div>
    <div class="p-1">
      <strong>Giá:</strong> {{ product.product_price }}
    </div>
    <div class="p-1">
      <strong>Mô tả:</strong> {{ product.product_description }}
    </div>
  </div>
</template>

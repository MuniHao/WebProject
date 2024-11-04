<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ProductForm from '@/components/ProductForm.vue';
import productsService from '@/services/products.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';

const props = defineProps({
  productId: { type: String, required: true }
});

const router = useRouter();
const route = useRoute();
const queryClient = useQueryClient();
const message = ref('');

const { data: product, isError, isLoading } = useQuery({
  queryKey: ['product', props.productId],
  queryFn: () => productsService.fetchProduct(props.productId),
  onError: (error) => {
    console.error('Error fetching product:', error); 
    router.push({
      name: 'notfound',
      params: { pathMatch: route.path.split('/').slice(1) },
      query: route.query,
      hash: route.hash,
    });
  },
});

// Update product
const updateMutation = useMutation({
  mutationFn: (updatedProduct) => productsService.updateProduct(props.productId, updatedProduct),
  onSuccess: () => {
    message.value = 'Sản phẩm được cập nhật thành công.';
    console.log('Product updated successfully'); 
    queryClient.invalidateQueries(['product', props.productId]);
  },
  onError: (error) => {
    console.error('Error updating product:', error); 
    message.value = 'Lỗi cập nhật Sản phẩm.';
  },
});

// Delete product
const deleteMutation = useMutation({
  mutationFn: (product_id) => productsService.deleteProduct(product_id),
  onSuccess: () => {
    console.log('Product deleted successfully'); 
    router.push({ name: 'productbook' });
  },
  onError: (error) => {
    console.error('Error deleting product:', error); 
  },
});

const onUpdateProduct = (product) => {
  console.log('Updating product:', product); 
  updateMutation.mutate(product);
};

const onDeleteProduct = () => {
  if (confirm('Bạn muốn xóa Sản phẩm này?')) {
    deleteMutation.mutate(props.productId);
  }
};
</script>

<template>
  <div v-if="!isLoading && !isError" class="page">
    <h4>Hiệu chỉnh Liên hệ</h4>
    <ProductForm
      :product="product"
      @submit:product="onUpdateProduct"
      @delete:product="onDeleteProduct"
    />
    <p>{{ message }}</p>
  </div>

  <div v-else-if="isLoading">
    <p>Đang tải dữ liệu...</p>
  </div>

  <div v-else>
    <p>Có lỗi xảy ra khi tải Sản phẩm.</p>
  </div>
</template>

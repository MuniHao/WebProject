<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ProductForm from '@/components/ProductForm.vue';
import productsService from '@/services/products.service';
import { useMutation, useQueryClient } from '@tanstack/vue-query';

//const router = useRouter();
const message = ref('');

const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: productsService.createProduct,
  onSuccess: () => {
    message.value = 'Sản phẩm được tạo thành công.';
    console.log('Product created successfully'); 
    queryClient.invalidateQueries(['products']);
    // router.push({ name: 'contactbook' });
  },
  onError: (error) => {
    console.error('Error creating product:', error); 
    message.value = 'Đã có lỗi xảy ra.';
  }
});

function onCreateProduct(product) {
  console.log('Creating product:', product); 
  mutation.mutate(product);
}

const defaultProduct = {
  product_image: '/public/images/blank.png',
  product_name: 'iPhone',
  product_color: 'Black',
  product_price: 800,
  product_description: '...',
};
</script>

<template>
  <div>
    <h4>Thêm mới Sản phẩm</h4>
    <ProductForm :product="defaultProduct" @submit:product="onCreateProduct" />
    <p>{{ message }}</p>
  </div>
</template>

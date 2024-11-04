<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import InputSearch from '@/components/InputSearch.vue';
import ProductList from '@/components/ProductList.vue';
import MainPagination from '@/components/MainPagination.vue';
import productsService from '@/services/products.service';

const router = useRouter();
const route = useRoute();
const totalPages = ref(1);
const currentPage = computed(() => {
  const page = Number(route.query?.page);
  if (Number.isNaN(page) || page < 1) return 1;
  return page;
});

const products = ref([]);
const selectedIndex = ref(-1);
const searchText = ref('');
const isLoading = ref(true); // Để theo dõi trạng thái tải
const error = ref(null); // Để theo dõi lỗi

// Map each product to a string for searching
const searchableProducts = computed(() =>
  products.value.map((product) => {
    const { product_name, product_color} = product;
    return [product_name, product_color].join('');
    //price will be add later
  })
);

// Products filtered by searchText
const filteredProducts = computed(() => {
  if (!searchText.value) return products.value;
  return products.value.filter((product, index) =>
    searchableProducts.value[index].includes(searchText.value)
  );
});

const selectedProduct = computed(() => {
  if (selectedIndex.value < 0) return null;
  return filteredProducts.value[selectedIndex.value];
});

// Get products for a specific page and order them by name
async function retrieveProducts(page) {
  isLoading.value = true; // Bắt đầu tải
  error.value = null; // Reset lỗi
  try {
    const chunk = await productsService.getProducts(page);
    totalPages.value = chunk.metadata.lastPage ?? 1;
    products.value = chunk.products.sort((current, next) => current.product_name.localeCompare(next.product_name));
    selectedIndex.value = -1;
  } catch (err) {
    console.log(err); // Ghi log chi tiết lỗi
    console.error('Error fetching products:', err); // Thêm ghi log chi tiết
    error.value = 'Đã có lỗi xảy ra khi tải sản phẩm.'; // Thiết lập thông báo lỗi
  } finally {
    isLoading.value = false; // Kết thúc tải
  }
}

// Handle delete all products event
async function onDeleteProducts() {
  if (confirm('Bạn muốn xóa tất cả Sản Phẩm?')) {
    try {
      await productsService.deleteAllProducts();
      totalPages.value = 1;
      products.value = [];
      selectedIndex.value = -1;
      changeCurrentPage(1);
    } catch (error) {
      console.log(error);
    }
  }
}

function goToAddProduct() {
  router.push({ name: 'product.add' });
}

function changeCurrentPage(page) {
  router.push({ name: 'productbook', query: { page } });
}

// Whenever searchText changes, reset selectedIndex
watch(searchText, () => (selectedIndex.value = -1));

// When currentPage changes, fetch products for currentPage
watch(currentPage, () => retrieveProducts(currentPage.value), { immediate: true });
</script>

<template>
  <div class="page row mb-5">
    <div class="mt-3 col-md-6">
      <h4>
        Danh sách sản phẩm
        <i class="fas fa-address-book"></i>
      </h4>
      <div class="my-3">
        <InputSearch v-model="searchText" />
      </div>
      <p v-if="isLoading">Đang tải danh bạ...</p> <!-- Thông báo đang tải -->
      <p v-if="error">{{ error }}</p> <!-- Thông báo lỗi -->
      <ProductList
        v-if="filteredProducts.length > 0 && !isLoading"
        :products="filteredProducts"
        v-model:selected-index="selectedIndex"
      />
      <p v-else-if="!isLoading">Không có liên hệ nào.</p> <!-- Không có liên hệ -->
      <div class="mt-3 d-flex flex-wrap justify-content-round align-items-center">
        <MainPagination
          :total-pages="totalPages"
          :current-page="currentPage"
          @update:current-page="changeCurrentPage"
        />
        <div class="w-100"></div>
        <button class="btn btn-sm btn-primary" @click="retrieveProducts(currentPage)">
          <i class="fas fa-redo"></i> Làm mới
        </button>
        <button class="btn btn-sm btn-success" @click="goToAddProduct">
          <i class="fas fa-plus"></i> Thêm mới
        </button>
        <button class="btn btn-sm btn-danger" @click="onDeleteProducts">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button>
      </div>
    </div>
    <div class="mt-3 col-md-6">
      <div v-if="selectedProduct">
        <h4>
          Chi tiết Sản phẩm
          <i class="fas fa-address-card"></i>
        </h4>
        <ProductCard v-if="selectedProduct" :product="selectedProduct" />
        <router-link
          v-if="selectedProduct?.product_id" 
          :to="{
            name: 'product.edit',
            params: { product_id: selectedProduct.product_id }
          }"
        >
          <span class="mt-2 badge text-bg-warning"> <i class="fas fa-edit"></i> Hiệu chỉnh</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  text-align: left;
  max-width: 750px;
}
</style>

<script setup>
import AppHeader from '@/components/AppHeader.vue';
import HeaderComponent from './components/Header.vue';
import FooterComponent from './components/Footer.vue';
</script>

<template>
  <HeaderComponent />
  <div class="container mt-3">
    <router-view />
  </div>
  <FooterComponent />

</template>

<style>
.page {
  max-width: 400px;
  margin: auto;
}
</style>

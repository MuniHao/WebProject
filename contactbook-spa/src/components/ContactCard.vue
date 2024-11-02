<script setup>
defineProps({
  contact: { type: Object, required: true },
});
</script>

<template>
  <div>
    <div class="p-1 w-75 h-75">
      <img class="img-fluid img-thumbnail" :src="contact.avatar" alt="" />
    </div>
    <div class="p-1">
      <strong>Tên:</strong> {{ contact.name }}
    </div>
    <div class="p-1">
      <strong>E-mail:</strong> {{ contact.email }}
    </div>
    <div class="p-1">
      <strong>Địa chỉ:</strong> {{ contact.address }}
    </div>
    <div class="p-1">
      <strong>Điện thoại:</strong> {{ contact.phone }}
    </div>
    <div class="p-1">
      <strong>Liên hệ yêu thích:&nbsp;</strong>
      <i v-if="contact.favorite" class="fas fa-check"></i>
      <i v-else class="fas fa-times"></i>
    </div>
  </div>
</template>

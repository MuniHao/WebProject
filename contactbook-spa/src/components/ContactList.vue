<script setup>
defineProps({
  contacts: { type: Array, default: () => [] },
  selectedIndex: { type: Number, default: -1 },
});

const $emit = defineEmits(['update:selectedIndex']);
</script>

<template>
  <ul class="list-group">
    <li
      class="list-group-item px-3"
      v-for="(contact, index) in contacts"
      :class="{ active: index === selectedIndex }"
      :key="contact.id"
      @click="$emit('update:selectedIndex', index)"
    >
      {{ contact.name }}
    </li>
  </ul>
</template>

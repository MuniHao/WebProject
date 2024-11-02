<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ContactForm from '@/components/ContactForm.vue';
import contactsService from '@/services/contacts.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';

const props = defineProps({
  contactId: { type: String, required: true }
});

const router = useRouter();
const route = useRoute();
const queryClient = useQueryClient();
const message = ref('');

const { data: contact, isError, isLoading } = useQuery({
  queryKey: ['contact', props.contactId],
  queryFn: () => contactsService.fetchContact(props.contactId),
  onError: (error) => {
    console.error('Error fetching contact:', error); 
    router.push({
      name: 'notfound',
      params: { pathMatch: route.path.split('/').slice(1) },
      query: route.query,
      hash: route.hash,
    });
  },
});

// Update contact
const updateMutation = useMutation({
  mutationFn: (updatedContact) => contactsService.updateContact(props.contactId, updatedContact),
  onSuccess: () => {
    message.value = 'Liên hệ được cập nhật thành công.';
    console.log('Contact updated successfully'); 
    queryClient.invalidateQueries(['contact', props.contactId]);
  },
  onError: (error) => {
    console.error('Error updating contact:', error); 
    message.value = 'Lỗi cập nhật Liên hệ.';
  },
});

// Delete contact
const deleteMutation = useMutation({
  mutationFn: (id) => contactsService.deleteContact(id),
  onSuccess: () => {
    console.log('Contact deleted successfully'); 
    router.push({ name: 'contactbook' });
  },
  onError: (error) => {
    console.error('Error deleting contact:', error); 
  },
});

const onUpdateContact = (contact) => {
  console.log('Updating contact:', contact); 
  updateMutation.mutate(contact);
};

const onDeleteContact = () => {
  if (confirm('Bạn muốn xóa Liên hệ này?')) {
    deleteMutation.mutate(props.contactId);
  }
};
</script>

<template>
  <div v-if="!isLoading && !isError" class="page">
    <h4>Hiệu chỉnh Liên hệ</h4>
    <ContactForm
      :contact="contact"
      @submit:contact="onUpdateContact"
      @delete:contact="onDeleteContact"
    />
    <p>{{ message }}</p>
  </div>

  <div v-else-if="isLoading">
    <p>Đang tải dữ liệu...</p>
  </div>

  <div v-else>
    <p>Có lỗi xảy ra khi tải Liên hệ.</p>
  </div>
</template>

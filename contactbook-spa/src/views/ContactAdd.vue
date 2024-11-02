<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ContactForm from '@/components/ContactForm.vue';
import contactsService from '@/services/contacts.service';
import { useMutation, useQueryClient } from '@tanstack/vue-query';

const router = useRouter();
const message = ref('');

const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: contactsService.createContact,
  onSuccess: () => {
    message.value = 'Liên hệ được tạo thành công.';
    console.log('Contact created successfully'); 
    queryClient.invalidateQueries(['contacts']);
    // router.push({ name: 'contactbook' });
  },
  onError: (error) => {
    console.error('Error creating contact:', error); 
    message.value = 'Đã có lỗi xảy ra.';
  }
});

function onCreateContact(contact) {
  console.log('Creating contact:', contact); 
  mutation.mutate(contact);
}

const defaultContact = {
  avatar: '/public/images/blank-profile-picture.png',
  name: '',
  email: '',
  address: '',
  phone: '',
  favorite: 0,
};
</script>

<template>
  <div>
    <h4>Thêm mới liên hệ</h4>
    <ContactForm :contact="defaultContact" @submit:contact="onCreateContact" />
    <p>{{ message }}</p>
  </div>
</template>

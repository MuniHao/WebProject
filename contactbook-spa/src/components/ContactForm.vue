<script setup>
import { ref, useTemplateRef } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
const props = defineProps({
  contact: { type: Object, required: true }
});
let avatarFileInput = useTemplateRef('avatar-file-input');
let avatarFile = ref(props.contact.avatar);
const $emit = defineEmits(['submit:contact', 'delete:contact']);
let validationSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(2, { message: 'Tên phải ít nhất 2 ký tự.' })
      .max(50, { message: 'Tên có nhiều nhất 50 ký tự.' }),
    email: z
      .string()
      .email({ message: 'E-mail không đúng.' })
      .max(50, { message: 'E-mail tối đa 50 ký tự.' }),
    address: z.string().max(100, { message: 'Địa chỉ tối đa 100 ký tự.' }),
    phone: z
      .string()
      .regex(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/g, {
        message: 'Số điện thoại không hợp lệ.'
      }),
    favorite: z.number().optional(),
    avatarFile: z.instanceof(File).optional()
  })
);
function previewAvatarFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (evt) => {
    avatarFile.value = evt.target.result;
  };
  reader.readAsDataURL(file);
}
function submitContact(values) {
  let formData = new FormData();
  for (let key in values) {
    if (values[key] !== undefined) {
      formData.append(key, values[key]);
    }
  }
  $emit('submit:contact', formData);
}
function deleteContact() {
  $emit('delete:contact', props.contact.id);
}
</script>
<template>
  <Form :validation-schema="validationSchema" @submit="submitContact">
    <div class="mb-3 w-50 h-50">
      <img
        class="img-fluid img-thumbnail"
        :src="avatarFile"
        alt=""
        @click="avatarFileInput.click()"
      />
      <Field name="avatarFile" v-slot="{ handleChange }">
        <input
          type="file"
          class="d-none"
          ref="avatar-file-input"
          @change="
            (event) => {
              handleChange(event);
              previewAvatarFile(event);
            }
          "
        />
      </Field>
    </div>
    <div class="mb-3">
      <label for="name" class="form-label">Tên</label>
      <Field name="name" type="text" class="form-control" :value="contact.name" />
      <ErrorMessage name="name" class="error-feedback" />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">E-mail</label>
      <Field name="email" type="email" class="form-control" :value="contact.email" />
      <ErrorMessage name="email" class="error-feedback" />
    </div>
    <div class="mb-3">
      <label for="address" class="form-label">Địa chỉ</label>
      <Field name="address" type="text" class="form-control" :value="contact.address" />
      <ErrorMessage name="address" class="error-feedback" />
    </div>
    <div class="mb-3">
      <label for="phone" class="form-label">Điện thoại</label>
      <Field name="phone" type="tel" class="form-control" :value="contact.phone" />
      <ErrorMessage name="phone" class="error-feedback" />
    </div>
    <div class="mb-3 form-check">
      <Field
        name="favorite"
        type="checkbox"
        class="form-check-input"
        :model-value="contact.favorite"
        :value="1"
        :unchecked-value="0"
      />
      <label for="favorite" class="form-check-label">
        <strong>Liên hệ yêu thích</strong>
      </label>
    </div>
    <div class="mb-3">
      <button class="btn btn-primary"><i class="fas fa-save"></i> Lưu</button>
      <button v-if="contact.id" type="button" class="ms-2 btn btn-danger" @click="deleteContact">
        <i class="fas fa-trash"></i> Xóa
      </button>
    </div>
  </Form>
</template>
<style scoped>
@import '@/assets/form.css';
</style>

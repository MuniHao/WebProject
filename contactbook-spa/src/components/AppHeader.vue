<template>
  <nav class="navbar navbar-expand bg-dark" data-bs-theme="dark">
    <div class="container-fluid d-flex justify-content-between">
      <a href="/" class="navbar-brand">
        Ứng dụng Quản lý danh bạ
      </a>
      <div class="navbar-nav ms-auto">
        <li class="nav-item">
          <router-link :to="{ name: 'contactbook' }" class="nav-link">
            Danh bạ
            <i class="fas fa-address-book"></i>
          </router-link>
        </li>
      </div>
    </div>
  </nav>
</template>

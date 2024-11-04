<template>
  <footer class="footer bg-dark">
    <div class="container py-5">
      <div class="row g-4">
        <!-- Logo và Social Media -->
        <div class="col-md-4">
          <div class="logo-foot mb-4">
            <a href="/">
              <img src="../image-shop/logo.png" alt="Logo" class="img-fluid" />
            </a>
          </div>
          <div class="footer-social">
            <h5 class="text-white mb-3">Kết nối với chúng tôi</h5>
            <div class="social-icons">
              <a href="https://www.facebook.com" target="_blank" class="social-icon">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.youtube.com" target="_blank" class="social-icon">
                <i class="fab fa-youtube"></i>
              </a>
              <a href="https://zalo.me" target="_blank" class="social-icon">
                <i class="fa-solid fa-hashtag"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- Hỗ trợ khách hàng -->
        <div class="col-md-4">
          <h5 class="text-white mb-4">Hỗ trợ khách hàng</h5>
          <ul class="footer-links">
            <li class="mb-2">
              <a href="/huong-dan-mua-hang">
                <i class="fas fa-angle-right me-2"></i>
                Hướng dẫn mua hàng
              </a>
            </li>
            <li class="mb-2">
              <a href="/chinh-sach-giao-hang">
                <i class="fas fa-angle-right me-2"></i>
                Chính sách giao hàng
              </a>
            </li>
          </ul>
        </div>

        <!-- Thông tin liên hệ -->
        <div class="col-md-4">
          <h5 class="text-white mb-4">Liên hệ</h5>
          <div class="contact-info">
            <div class="d-flex align-items-center mb-3">
              <i class="fas fa-phone-alt me-3"></i>
              <a href="tel:1900969642" class="contact-link">1900.0000</a>
            </div>
            <div class="d-flex align-items-center mb-3">
              <i class="fas fa-envelope me-3"></i>
              <a href="mailto:hotroTHshopphone@gmail.com" class="contact-link">
                hotroTHshopphone@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="copyright">
      <div class="container">
        <p class="text-center mb-0">© 2024. The TH Shop Phone. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
}
</script>

<style scoped>
.footer {
  background: linear-gradient(180deg, #212529 0%, #000000 100%);
  color: #ffffff;
}

.logo-foot img {
  max-height: 30px;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.logo-foot img:hover {
  transform: scale(1.05);
}

.social-icons {
  display: flex;
  gap: 15px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
  color: #007bff;
}

.zalo-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links a {
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-links a:hover {
  color: #007bff;
  transform: translateX(5px);
}

.contact-info {
  color: #ffffff;
}

.contact-link {
  color: #ffffff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #007bff;
}

.copyright {
  background: rgba(0, 0, 0, 0.2);
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .col-md-4 {
    text-align: center;
  }
  
  .social-icons {
    justify-content: center;
  }
  
  .contact-info {
    justify-content: center;
  }
}
</style>
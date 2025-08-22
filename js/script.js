// 导航栏滚动效果
const navbar = document.getElementById('navbar');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const languageToggle = document.getElementById('language-toggle');
const languageDropdown = document.getElementById('language-dropdown');
const languageOptions = document.querySelectorAll('.language-option');

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 移动菜单切换
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
}

// 点击移动菜单链接后关闭菜单
const mobileLinks = document.querySelectorAll('#mobile-menu a');
mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
    });
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// 多语言切换功能
// 默认语言为英文
let currentLang = 'en'; 
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' }
];

// 语言切换函数
function switchLanguage(langCode) {
  if (!translations[langCode]) {
    console.error(`Translation for ${langCode} not found`);
    return;
  }
  
  // 更新页面上的所有文本
  document.querySelectorAll('[data-lang-key]').forEach(element => {
    const key = element.getAttribute('data-lang-key');
    if (translations[langCode][key]) {
      element.textContent = translations[langCode][key];
    }
  });
  
  // 更新当前语言
  currentLang = langCode;
  localStorage.setItem('preferredLanguage', langCode);
  
  // 更新语言选择器显示
  const selector = document.getElementById('language-selector');
  if (selector) {
    selector.textContent = languages.find(lang => lang.code === langCode)?.name || langCode;
  }
  
  // 触发语言变更事件
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: langCode } }));
}

// 初始化语言选择器
function initLanguageSelector() {
  const selector = document.getElementById('language-selector');
  const dropdown = document.getElementById('language-dropdown');
  
  if (selector && dropdown) {
    // 清空现有选项
    dropdown.innerHTML = '';
    
    // 添加语言选项
    languages.forEach(lang => {
      const option = document.createElement('div');
      option.className = 'language-option';
      option.setAttribute('data-lang-code', lang.code);
      option.textContent = lang.name;
      
      // 添加点击事件
      option.addEventListener('click', () => {
        switchLanguage(lang.code);
        dropdown.classList.add('hidden');
      });
      
      dropdown.appendChild(option);
    });
    
    // 切换下拉菜单显示
    selector.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });
    
    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', (e) => {
      if (!selector.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }
  
  // 检查本地存储中的首选语言
  const savedLang = localStorage.getItem('preferredLanguage');
  if (savedLang && languages.some(lang => lang.code === savedLang)) {
    switchLanguage(savedLang);
  } else {
    // 使用浏览器语言或默认语言
    const browserLang = navigator.language.split('-')[0];
    if (languages.some(lang => lang.code === browserLang)) {
      switchLanguage(browserLang);
    }
  }
}

// 初始化语言选择器
initLanguageSelector();

// 初始化页面
window.addEventListener('DOMContentLoaded', function() {
    // 检查当前页面URL，高亮对应的导航链接
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (currentPath === linkPath || (currentPath === '/' && linkPath.includes('index.html'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // 添加淡入动画效果
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((element, index) => {
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});

// 表单验证
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const submitButton = document.getElementById('submit-button');
        const formMessage = document.getElementById('form-message');
        
        // 重置错误信息
        formMessage.textContent = '';
        formMessage.className = '';
        
        // 简单验证
        let isValid = true;
        
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Name is required');
            isValid = false;
        } else {
            hideError(nameInput);
        }
        
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            hideError(emailInput);
        }
        
        if (!messageInput.value.trim()) {
            showError(messageInput, 'Message is required');
            isValid = false;
        } else {
            hideError(messageInput);
        }
        
        if (isValid) {
            // 显示加载状态
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="loading"></span> Sending...';
            
            // 模拟表单提交
            setTimeout(() => {
                formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                formMessage.className = 'text-green-600 font-medium mt-4';
                
                // 重置表单
                contactForm.reset();
                
                // 恢复按钮状态
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
                
                // 5秒后清除消息
                setTimeout(() => {
                    formMessage.textContent = '';
                }, 5000);
            }, 1500);
        }
    });
}

// 邮箱验证函数
function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// 显示错误信息
function showError(input, message) {
    const formControl = input.parentElement;
    const errorElement = formControl.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
    
    input.classList.add('border-red-500');
    input.classList.add('focus:border-red-500');
    input.classList.add('focus:ring-red-500');
}

// 隐藏错误信息
function hideError(input) {
    const formControl = input.parentElement;
    const errorElement = formControl.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.add('hidden');
    }
    
    input.classList.remove('border-red-500');
    input.classList.remove('focus:border-red-500');
    input.classList.remove('focus:ring-red-500');
}

// 图片懒加载
if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    img.setAttribute('src', src);
                    img.removeAttribute('data-src');
                }
                
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imgObserver.observe(img);
    });
} else {
    // 降级处理：直接加载所有图片
    document.querySelectorAll('img[data-src]').forEach(img => {
        img.setAttribute('src', img.getAttribute('data-src'));
        img.removeAttribute('data-src');
    });
}
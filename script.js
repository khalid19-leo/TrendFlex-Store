document.addEventListener("DOMContentLoaded", () => {
  // دالة تشغيل السلايدر
  function initializeSlider(sliderId) {
    const sliderContainer = document.getElementById(sliderId); // ده الـ div بتاع الـ product-slider (tshirts-slider أو shoes-slider)
    if (!sliderContainer) return; // التأكد أن السلايدر موجود

    // عشان نحصل على المنتجات (عناصر الـ .sell)
    const products = Array.from(sliderContainer.children);

    // لو مفيش منتجات أو منتج واحد بس، مش محتاجين سلايدر
    if (products.length <= 1) {
      const prevButton = document.querySelector(
        `button.slider-button.prev[data-target="${sliderId}"]`
      );
      const nextButton = document.querySelector(
        `button.slider-button.next[data-target="${sliderId}"]`
      );
      if (prevButton) prevButton.style.display = "none";
      if (nextButton) nextButton.style.display = "none";
      return;
    }

    let currentIndex = 0;

    const prevButton = document.querySelector(
      `button.slider-button.prev[data-target="${sliderId}"]`
    );
    const nextButton = document.querySelector(
      `button.slider-button.next[data-target="${sliderId}"]`
    );

    function updateSlider() {
      // نحصل على العرض الكامل للحاوية المرئية للسلايدر
      // الـ parentElement بتاع product-slider هو slider-container الخارجي
      const visibleContainerWidth = sliderContainer.parentElement.offsetWidth;

      // نحسب عرض المنتج الواحد بدقة، شامل المارجن
      // لازم يكون فيه منتج واحد على الأقل عشان نحسب عرضه
      let productTotalWidth = 0;
      if (products.length > 0) {
        const firstProduct = products[0];
        const productStyle = getComputedStyle(firstProduct);
        const productMarginLeft = parseFloat(productStyle.marginLeft);
        const productMarginRight = parseFloat(productStyle.marginRight);
        productTotalWidth = firstProduct.offsetWidth + productMarginLeft + productMarginRight;
      } else {
          // لو مفيش منتجات، متعملش أي تحويل
          sliderContainer.style.transform = `translateX(0px)`;
          if (prevButton) prevButton.style.display = "none";
          if (nextButton) nextButton.style.display = "none";
          return;
      }


      // عدد المنتجات اللي ممكن تظهر في الرؤية مرة واحدة
      const itemsVisible = Math.max(1, Math.floor(visibleContainerWidth / productTotalWidth));

      // أقصى إندكس ممكن نوصل له عشان آخر منتج يكون ظاهر بالكامل
      // لو عدد المنتجات أقل من أو يساوي اللي بيظهر في الشاشة، يبقى أقصى إندكس هو 0
      const maxIndex = Math.max(0, products.length - itemsVisible);

      // التأكد أن الـ currentIndex مش بيعدي الحدود
      currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

      // تحريك السلايدر
      sliderContainer.style.transform = `translateX(${-currentIndex * productTotalWidth}px)`;

      // التحكم في ظهور الأزرار
      if (prevButton) {
        prevButton.style.display = currentIndex === 0 ? "none" : "block";
      }
      if (nextButton) {
        nextButton.style.display = currentIndex >= maxIndex ? "none" : "block";
      }

      // لو كل المنتجات ظاهرة في الشاشة، نخفي الأزرار كلها
      if (products.length <= itemsVisible) {
        if (prevButton) prevButton.style.display = "none";
        if (nextButton) nextButton.style.display = "none";
      }
    }

    // زر السابق
    if (prevButton) {
      prevButton.addEventListener("click", () => {
        currentIndex--;
        updateSlider();
      });
    }

    // زر التالي
    if (nextButton) {
      nextButton.addEventListener("click", () => {
        currentIndex++;
        updateSlider();
      });
    }

    // تحديث السلايدر عند تحميل الصفحة وفي حالة تغيير حجم الشاشة
    updateSlider(); // أول مرة عند التحميل
    window.addEventListener('resize', updateSlider); // عند تغيير حجم النافذة
  }

  // تشغيل السلايدر لكل قسم (T-Shirts و Shoes)
  initializeSlider("tshirts-slider");
  initializeSlider("shoes-slider");
});

# Toast / Notification Audit — Apex Athletics Frontend

**تاريخ الفحص:** 2026-07-04
**المكتبة المستخدمة:** `react-hot-toast` v2.6.0 (الإصدار الوحيد — لا يوجد Sonner أو غيره)
**عدد ملفات تحتوي على `toast`:** 16 ملف
**عدد الـ `<Toaster>` المُركَّبة:** 1 فقط (في `providers.tsx`)

---

## 1. إعداد الـ Toaster المركزي

**الملف:** `src/app/providers.tsx`

```tsx
<Toaster
  position="top-right"
  toastOptions={{
    style: {
      background: '#171717',
      color: '#fff',
      border: '1px solid #333333'
    }
  }}
/>
```

| الإعداد | القيمة | الملاحظة |
|---|---|---|
| `position` | `"top-right"` | ثابتة لكل التطبيق |
| `duration` | غير محدد — يستخدم القيمة الافتراضية (4000ms لـ success/error) | مقبول |
| `style.background` | `#171717` | متناسق مع ثيم التطبيق الداكن |
| `style.color` | `#fff` | |
| `style.border` | `1px solid #333333` | |
| `z-index` | غير محدد — القيمة الافتراضية لـ react-hot-toast هي 9999 | أعلى من navbar (z-50 = 50) |

> ملاحظة مهمة على الـ z-index:
> الـ navbar تستخدم z-50 (= 50 في Tailwind).
> الـ Toaster الافتراضي من react-hot-toast يُركَّب بـ z-index: 9999.
> لا يوجد تعارض — الـ toast يظهر دائماً فوق الـ navbar.
> في لوحتَي الـ Admin والـ Vendor، يوجد mobile overlay بـ z-50، وهو أيضاً أقل من 9999 — لا تعارض.

---

## 2. جدول كل استخدامات الـ Toast

### Auth Pages

| الصفحة / Component | نوع الرسالة | الرسالة | مشكلة؟ |
|---|---|---|---|
| /login (L58) | toast.success | 'Login successful!' | تكرار محتمل — يُطلَق في onSubmit ثم تُعيد useEffect التوجيه |
| /login (L69) | toast.error | getErrorMessage(err, 'Invalid credentials') | |
| /register (L117) | toast.success | Account created as [role]! | ~~رسالة نجاح مزدوجة: toast + inline banner~~ ✅ **FIXED (2026-07-04):** تم حذف toast.success — الـ inline banner يكفي |
| /register (L126) | toast.error | errorMessage | ~~رسالة خطأ مزدوجة: toast + inline banner~~ ✅ **FIXED (2026-07-04):** تم حذف toast.error — الـ inline banner يكفي |
| /forgot-password (L27) | toast.success | 'If that email exists, a reset link was sent.' | |
| /forgot-password (L29) | toast.error | getErrorMessage(error, 'Failed to process request') | |
| /reset-password (L52) | toast.error | 'Reset token is missing or invalid' | يُطلَق داخل useEffect عند أول render إذا كان !token — مع وجود inline error UI، يوجد تكرار بصري |
| /reset-password (L61) | toast.success | 'Password reset successfully. Please sign in.' | |
| /reset-password (L64) | toast.error | getErrorMessage(error, 'Failed to reset password') | |

### Customer-Facing Components

| الصفحة / Component | نوع الرسالة | الرسالة | مشكلة؟ |
|---|---|---|---|
| Navbar (L34) | toast.error | message (dynamic) | stacking محتمل — إذا ضغط المستخدم على Cart و Wishlist بسرعة يظهر toast مزدوج |
| AddToCartForm (L29) | toast.error | 'Please sign in to add items to your cart' | |
| AddToCartForm (L37) | toast.error | 'Please select a size' | |
| AddToCartForm (L41) | toast.error | 'Please select a color' | |
| AddToCartForm (L54) | toast.success | 'Added to cart!' | |
| AddToCartForm (L58) | toast.error | getErrorMessage(err, 'Failed to add to cart') | |
| ProductCard (L41) | toast.error | 'Please sign in as a customer to use wishlist' | stacking محتمل — يظهر مع Navbar toast |

### Checkout

| الصفحة / Component | نوع الرسالة | الرسالة | مشكلة؟ |
|---|---|---|---|
| /checkout (L46) | toast.success | Promo code applied: X% off! | |
| /checkout (L48) | toast.error | getErrorMessage(error, 'Invalid promo code') | |
| /checkout (L106) | toast.loading | 'Redirecting to Stripe...' | ~~لا يُغلَق يدوياً~~ ✅ **FIXED (2026-07-04):** أُضيف `return` بعد `window.location.assign` — الـ catch لا يُطلَق بعد الـ redirect |
| /checkout (L113) | toast.error | errorMessage | ~~stacking مع loading toast~~ ✅ **FIXED** تبعاً للإصلاح أعلاه |

### Reviews

| الصفحة / Component | نوع الرسالة | الرسالة | مشكلة؟ |
|---|---|---|---|
| ReviewForm (L24) | toast.error | 'Please select a star rating' | الملف يستخدم design system مختلف (bg-surface, btn-primary) بدلاً من ks-* classes |
| ReviewForm (L29) | toast.error | 'Comment must be at least 10 characters' | |
| ReviewForm (L37) | toast.success | 'Thank you for your review!' | |
| ReviewForm (L42) | toast.error | getErrorMessage(err, 'Failed to submit review') | |

### Vendor Dashboard

| الصفحة / Component | نوع الرسالة | الرسالة | مشكلة؟ |
|---|---|---|---|
| vendor/ProductForm (L86) | toast.error | 'Please wait for image upload to finish before saving' | |
| vendor/ProductForm (L102) | toast.success | 'Product updated successfully' | |
| vendor/ProductForm (L105) | toast.success | 'Product created successfully' | |
| vendor/ProductForm (L109) | toast.error | getErrorMessage(error, 'Something went wrong') | رسالة مبهمة — 'Something went wrong' غير وصفية |
| vendor/ProductForm (L128) | toast.error | 'Please upload an image file' | |
| vendor/ProductForm (L132) | toast.error | 'File size must be less than 5MB' | |
| vendor/ProductForm (L166) | toast.success | 'Image uploaded successfully' | stacking محتمل مع success عند حفظ المنتج |
| vendor/ProductForm (L169) | toast.error | getErrorMessage(error, 'Upload failed') | |
| /vendor-dashboard/products (L18) | toast.success | 'Product deleted strictly' | رسالة غريبة — 'strictly' غير مناسبة للمستخدم |
| /vendor-dashboard/products (L20) | toast.error | 'Failed to delete product' | |
| /vendor-dashboard/payouts (L19) | toast.error | 'Failed to start onboarding process' | |
| /vendor-dashboard/orders/[id] (L25) | toast.success | 'Line item status updated' | |
| /vendor-dashboard/orders/[id] (L27) | toast.error | 'Failed to update status' | |

### Admin Dashboard

| الصفحة / Component | نوع الرسالة | الرسالة | مشكلة؟ |
|---|---|---|---|
| /admin/products/[id] (L29) | toast.success | Platform scope enforced: Asset [status] | رسالة تقنية مبهمة — لغة داخلية |
| /admin/products/[id] (L31) | toast.error | 'Failed to commit moderation action' | رسالة تقنية — 'commit' جارجون |
| /admin/customers/[id] (L21) | toast.success | 'Customer banned successfully' | |
| /admin/customers/[id] (L26) | toast.error | error.response?.data?.message OR 'Failed to ban customer' | عدم استخدام getErrorMessage() المُوحَّد |
| /admin/admins (L25) | toast.success | 'Administrator successfully added' | |
| /admin/admins (L30) | toast.error | getErrorMessage(err, 'Failed to add administrator') | |
| /admin/admins (L170) | toast.success | 'Admin removed' | |
| /admin/admins (L173) | toast.error | getErrorMessage(err, 'Failed to remove admin') | |
| /admin/orders/[id] (L22) | toast.success | 'Global Order Ledger Updated' | رسالة تقنية — 'Ledger' لغة داخلية |
| /admin/orders/[id] (L24) | toast.error | 'Failed to commit ledger update' | رسالة تقنية — 'commit ledger' جارجون |
| /admin/vendors/[id] (L21) | toast.success | 'Vendor suspended successfully' | |
| /admin/vendors/[id] (L26) | toast.error | error.response?.data?.message OR 'Failed to suspend vendor' | عدم استخدام getErrorMessage() |
| /admin/vendors/[id] (L35) | toast.success | 'Password reset enforced' | 'enforced' — لغة تقنية غير ودية |
| /admin/vendors/[id] (L40) | toast.error | error.response?.data?.message OR 'Failed to enforce reset' | عدم استخدام getErrorMessage() |

### Auth Hooks

| الصفحة / Component | نوع الرسالة | الرسالة | مشكلة؟ |
|---|---|---|---|
| useAuth → useUpdateProfile (L100) | toast.success | 'Profile updated successfully' | |
| useAuth → useUpdateProfile (L103) | toast.error | getErrorMessage(error, 'Failed to update profile') | |
| useAuth → useLogout (L119) | toast.success | 'Logged out successfully' | |

---

## 3. تقرير المشاكل الموجودة

### مشاكل حرجة

| # | الملف | المشكلة | التأثير |
|---|---|---|---|
| 1 | checkout/page.tsx (L106) | ~~toast.loading لا يُغلَق يدوياً قبل toast.error~~ | ✅ **FIXED (2026-07-04)** — أُضيف `return` بعد `window.location.assign` |
| 2 | register/page.tsx (L117) | ~~رسالة نجاح مزدوجة: toast + inline success banner~~ | ✅ **FIXED (2026-07-04)** — حُذف `toast.success` |
| 3 | register/page.tsx (L126) | ~~رسالة خطأ مزدوجة: toast + inline error banner~~ | ✅ **FIXED (2026-07-04)** — حُذف `toast.error` |

### مشاكل متوسطة

| # | الملف | المشكلة | التأثير |
|---|---|---|---|
| 4 | Navbar.tsx (L34) | stacking محتمل عند النقر السريع على Cart + Wishlist | toast مزدوج لنفس الخطأ |
| 5 | reset-password/page.tsx (L52) | toast.error داخل useEffect يُطلَق عند أول render إذا كان !token | يتكرر مع inline error UI |
| 6 | vendor-dashboard/products (L18) | رسالة "Product deleted strictly" — صياغة خاطئة | نص غير احترافي |
| 7 | admin/products/[id] (L29) | "Platform scope enforced: Asset..." — لغة تقنية | غير قابلة للفهم |
| 8 | admin/orders/[id] (L22) | "Global Order Ledger Updated" — لغة تقنية | غير ودية |

### ملاحظات بسيطة

| # | الملف | الملاحظة |
|---|---|---|
| 9 | admin/customers/[id] (L26) | يعالج الخطأ يدوياً بدلاً من getErrorMessage() |
| 10 | admin/vendors/[id] (L26 + L40) | يعالج الخطأ يدوياً في مكانين بدلاً من getErrorMessage() |
| 11 | ReviewForm.tsx | الملف يستخدم design system مختلف (btn-primary, bg-surface) بينما بقية التطبيق يستخدم ks-* classes |

---

## 4. ملخص التحليل حسب المحاور

### Positioning
متسق تماماً. كل الـ toasts تظهر في top-right لأن الـ Toaster موجود مرة واحدة فقط في providers.tsx. لا يوجد أي Toaster إضافي في admin layout أو vendor layout.

### Z-Index
لا تعارض. الـ Toaster يستخدم z-index: 9999 افتراضياً، وهو أعلى من:
- الـ Navbar: z-50 (= 50)
- الـ Mobile sidebar overlay في DashboardLayout: z-50
- الـ wishlist button في ProductCard: z-10

### Styling
متسق من حيث الـ toast نفسه (اللون الداكن #171717، حدود رمادية).
ملاحظة: ReviewForm.tsx يستخدم design system مختلف في بنيته، لكن الـ toast المُطلَق منه يبدو بنفس الشكل المركزي.

### Duration
مقبول. لا يوجد duration مخصص في أي مكان. react-hot-toast الافتراضي:
- toast.success و toast.error: 4000ms — مناسب
- toast.loading: لا ينتهي تلقائياً — يتطلب toast.dismiss() يدوياً

### Stacking / التكرار
مشاكل محلولة (3/3 Critical Fixed):
1. /checkout — ✅ FIXED: `return` بعد `window.location.assign` يمنع الـ catch من التشغيل بعد الـ loading toast
2. /register — ✅ FIXED: حُذف `toast.success` و`toast.error` — الـ inline banners تكفي
3. Navbar — لا يزال قائماً (stacking محتمل عند النقر السريع على Cart + Wishlist)

---

## 5. الأماكن التي لا تستخدم Toast

الصفحات التالية تملك أخطاء لكن لا تستخدم toast (تعرضها inline فقط):
- /account/* — تُدار كل الأخطاء عبر form validation inline
- /wishlist — لا toast (يستخدم wishlist hook فقط)
- /cart — لا toast

---

تم الفحص بواسطة Antigravity — آخر تحديث: 2026-07-04 (إصلاح 3 مشاكل حرجة).

# 🚀 دليل رفع Velour Beauty على Render.com

## 📋 المتطلبات
- حساب GitHub (موجود)
- حساب Render.com (مجاني)
- MongoDB Atlas (تم إعداده)

---

## 🔧 بيانات الإنتاج

### MongoDB Atlas
```
MONGODB_URI=mongodb+srv://randorij27_db_user:ShopHup2026@shophup.7l4igxy.mongodb.net/?appName=ShopHup
```

### متغيرات البيئة الأخرى
```
JWT_SECRET=velour_beauty_render_production_2024
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=10000
```

---

## 🚀 خطوات الرفع على Render.com

### 1️⃣ إنشاء حساب Render.com
1. اذهب إلى: https://render.com
2. اضغط "Sign Up"
3. اختر "Sign up with GitHub"
4. امنح صلاحيات الوصول لمستودع Velour-Beauty

### 2️⃣ رفع Backend API
1. اضغط "New +" → "Web Service"
2. اختر مستودع `r1356-w/Velour-Beauty`
3. **الإعدادات:**
   - Name: `velour-beauty-api`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Instance Type: `Free`

4. **Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://randorij27_db_user:ShopHup2026@shophup.7l4igxy.mongodb.net/?appName=ShopHup
   JWT_SECRET=velour_beauty_render_production_2024
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   PORT=10000
   ```

5. اضغط "Create Web Service"

### 3️⃣ رفع Frontend
1. اضغط "New +" → "Static Site"
2. اختر نفس المستودع `r1356-w/Velour-Beauty`
3. **الإعدادات:**
   - Name: `velour-beauty-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
   - Add Environment Variable:
     ```
     REACT_APP_API_URL=https://velour-beauty-api.onrender.com/api
     ```

4. **Advanced Settings:**
   - Add Custom Redirect:
     - Type: `Rewrite`
     - Source: `/api/*`
     - Destination: `https://velour-beauty-api.onrender.com/api/*`

5. اضغط "Create Static Site"

---

## 🌱 تشغيل الـ Seed على الإنتاج

بعد رفع الـ Backend:
1. افتح الرابط: `https://velour-beauty-api.onrender.com/api/seed`
2. انتظر حتى تظهر رسالة النجاح

---

## 🎉 الروابط النهائية

- **Backend API**: `https://velour-beauty-api.onrender.com`
- **Frontend**: `https://velour-beauty-frontend.onrender.com`
- **Health Check**: `https://velour-beauty-api.onrender.com/api/health`

---

## 📱 اختبار على الموبايل

1. افتح `https://velour-beauty-frontend.onrender.com` على هاتفك
2. سجل حساب جديد
3. اختبر التسوق والدفع
4. تأكد من كل شيء يعمل

---

## 🔄 تحديث التغييرات

أي تغيير في الكود:
1. ادفع التغييرات إلى GitHub
2. Render سيقوم بالتحديث تلقائياً

---

## 🆘 استكشاف الأخطاء

### إذا لم يعمل الـ API:
1. تحقق من Render Logs
2. تأكد من متغيرات البيئة صحيحة
3. تأكد من MongoDB Atlas يعمل

### إذا لم يعمل الـ Frontend:
1. تحقق من رابط الـ API
2. تأكد من بناء الـ React نجح
3. تحقق من الـ redirects

---

## 📞 معلومات سريعة

- **Backend**: Node.js + Express
- **Frontend**: React + Tailwind CSS
- **Database**: MongoDB Atlas
- **Hosting**: Render.com (مجاني)
- **SSL**: تلقائي
- **Domain**: مجاني من Render

---

**ملاحظة:** الرفع على Render.com أسهل من Vercel للمبتدئين! 🌸

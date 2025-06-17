# 🧭 Onboardly Frontend

Frontend de **Onboardly**, una aplicación diseñada para gestionar el proceso de onboarding técnico de nuevos colaboradores. Esta interfaz está construida con **Angular 19**, utiliza **señales reactivas** y está desplegada en **AWS S3 + CloudFront**.

---

## 📦 Tecnologías utilizadas

- ✅ Angular 20 (con Standalone Components y Signals)
- ✅ TypeScript
- ✅ SCSS y diseño responsivo
- ✅ FullCalendar para gestión de eventos
- ✅ Sendgrid para envío de correos
- ✅ AWS S3 + CloudFront (Despliegue)
- ✅ GitHub Actions (CI/CD)
- ✅ Comunicación con API REST en Java Spring Boot

---

## 🚀 Funcionalidades

- 📋 Listado y creación de colaboradores.
- 📅 Visualización de eventos técnicos en un calendario interactivo.
- ✉️ Envío de recordatorios por correo.
- ✅ Validaciones reactivas en formularios.

---

## 🛠️ Instalación local

```bash
git clone https://github.com/CSALAZ5/Onboardly-front.git
cd Onboardly-front
npm install
ng serve
````

> La app estará disponible en `http://localhost:4200`

---

## ⚙️ Configuración

Asegúrate de tener un archivo `environment.ts` en `src/environments/` con la siguiente estructura:

```ts
export const host = 'http://onboardly-backend-env.eba-pxdbzrsx.us-east-1.elasticbeanstalk.com';

export const environment = {
  production: false,
  api: { // Rest-full api data
    colaboradores: `${ host }/api/colaboradores`,
    calendario: `${ host }/api/calendario`,
    mail: `${ host }/api/mail`
  }

};
```

En producción se usa `environment.prod.ts` con el endpoint real del backend desplegado en AWS Beanstalk.

---

## 📤 Despliegue

El despliegue se realiza mediante GitHub Actions y se sincroniza automáticamente el contenido del directorio `dist/browser/` a un bucket de S3. CloudFront sirve como CDN para distribuir la app.

Para compilar en modo producción:

```bash
ng build --configuration=production
```

El contenido se genera en `dist/browser`.

---

## 🧪 Scripts útiles

* `ng serve` - Levanta el servidor local de desarrollo.
* `ng build` - Compila el proyecto.
* `npm run lint` - Linting del código.
* `npm run format` - Formatea con Prettier.

---

## ✅ Estado del proyecto

* 🔄 En desarrollo
* 🧪 Testeado localmente y desplegado manualmente en ambiente AWS
* 🔐 Backend protegido con CORS configurado
* 🖥️ Preparado para entornos de staging

---

## ℹ️ Información adicional

Este proyecto es de carácter **personal** y fue desarrollado como solución a un **reto técnico individual**. No representa un producto comercial ni está destinado para uso en producción real.

Aunque el flujo ideal de despliegue contempla el uso de **GitHub Actions** para publicar automáticamente la aplicación en un **bucket S3**, actualmente el proceso automatizado **falla** debido a **incompatibilidades entre FullCalendar y Angular 20**.

Por esta razón, el **despliegue final se realizó manualmente**, compilando el proyecto en local y cargando los archivos estáticos al bucket de S3 de forma directa.

---

## 🧑‍💻 Autor

Christian Salazar
[github.com/CSALAZ5](https://github.com/CSALAZ5)

---

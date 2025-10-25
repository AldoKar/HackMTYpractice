# Desplegar en Vercel

## Opción 1: Desde GitHub (Recomendado)

1. Sube tu código a GitHub si aún no lo has hecho:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Ve a [vercel.com](https://vercel.com)
3. Inicia sesión con tu cuenta de GitHub
4. Click en "Add New Project"
5. Importa tu repositorio `HackMTYpractice`
6. Vercel detectará automáticamente que es un proyecto Vite
7. Click en "Deploy"

**Variables de entorno:**
- En el dashboard de Vercel, ve a Settings → Environment Variables
- Agrega:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_GEIMINI_API_KEY`

## Opción 2: Desde la terminal

1. Instala Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Despliega:
   ```bash
   vercel
   ```

3. Sigue las instrucciones en pantalla

## Tu sitio estará en:
`https://tu-proyecto.vercel.app`

## Actualizaciones automáticas:
Cada vez que hagas push a GitHub, Vercel desplegará automáticamente los cambios.

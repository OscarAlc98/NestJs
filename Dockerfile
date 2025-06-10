# ====== STAGE 1: Build ======
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluye dev)
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Compilar el proyecto (NestJS -> TypeScript -> JavaScript)
RUN npm run build


# ====== STAGE 2: Production ======
FROM node:20-alpine AS production

# Establecer variable de entorno
ENV NODE_ENV=production

# Establecer directorio de trabajo
WORKDIR /app

# Copiar solo lo necesario desde el build
COPY package*.json ./
RUN npm install --omit=dev

# Copiar archivos compilados desde el stage anterior
COPY --from=builder /app/dist ./dist

# Exponer el puerto (ajusta si usas otro)
EXPOSE 3001

# Comando de inicio
CMD ["node", "dist/main.js"]

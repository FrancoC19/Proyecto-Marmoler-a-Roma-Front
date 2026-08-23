

# Marmolería Roma - Sistema de Gestión

Sistema completo de gestión de pedidos, clientes, empleados ,materiales y piletas para la Marmolería Roma.

Incluye:
- **Frontend:** Angular 20
- **Backend:** Spring Boot
- **Java:** 22

---

## 📌 Descripción

Este proyecto permite gestionar:

- Empleados y sus roles.  
- Clientes y direcciones asociadas.  
- Materiales, piletas, molduras y grifería.  
- Pedidos completos con cliente, empleado, material, pileta, seña y dirección.  
- Observaciones, fechas, descuentos y cálculos automáticos.

El frontend tiene formularios reactivos con validaciones y listados dinámicos.  
El backend provee API REST para interactuar con la base de datos.

---

## Tecnologías 

| Área        | Tecnología / Librería |        
|------------|------------------------|
| Frontend   | Angular CLI            |      
| Frontend   | Angular Core           |    
| Frontend   | Node.js                |   
| Frontend   | npm                    |    
| Frontend   | TypeScript             |      
| Frontend   | RxJS                   |     
| Frontend   | Zone.js                |      
| Backend    | Java                   |     
| Backend    | Spring Boot            |     
| Backend    | Maven                  |     
| Base de datos | MySQL               |     

---

### Instalación y ejecución

## Backend (Spring Boot)

1. Clonar el repositorio y entrar al directorio backend:

git clone <URL_DEL_REPOSITORIO>
cd MarmoleriaRomaBackend

2. Ejecutar el proyecto en IntellIJIDEA o aplicacion similar

3. Remplasar los datos de la base de datos en "application.properties"

4. Ejecutar
--La API REST quedará disponible en http://localhost:8080

## Frontend (Angular)

1. Entrar al directorio frontend
   
cd MarmoleriaRomaFront

2. Instalar dependencias:

npm install

3. Ejecutar

ng serve

-- Abrir en navegador: http://localhost:4200

### Estructura General del proyecto

MarmoleriaRomaBackend/
 ├─ src/main/java/...
 │   ├─ controllers/       # Controladores REST
 │   ├─ services/          # Lógica de negocio
 │   ├─ models/            # Entidades JPA
 │   ├─ repositories/      # Interfaces JPA
 ├─ src/main/resources/    # application.properties, SQL iniciales

MarmoleriaRomaFront/
 ├─ src/app/
 │   ├─ Componentes/       # Formularios, Listados, UI
 │   ├─ Models/            # Modelos de datos
 │   ├─ Services/          # Servicios HTTP
 ├─ assets/                # Recursos estáticos

## Uso

- Los formularios del frontend tienen validaciones (campos obligatorios, email, DNI de 7 dígitos, números positivos).

- Los desplegables (select) cargan datos dinámicamente desde la API REST.

- Permite buscar clientes por DNI o nombre, seleccionar direcciones y asignar empleados/materiales/piletas a pedidos.

- Guardar, modificar y eliminar registros tanto de clientes como de empleados y pedidos.

## Notas adicionales

- Backend y frontend deben ejecutarse simultáneamente para funcionar correctamente.

- Validaciones incluidas: campos requeridos, email válido, números positivos, DNI argentino.








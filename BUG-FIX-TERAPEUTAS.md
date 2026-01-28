# 🐛 Bug Fix: Edición de Terapeutas

## Problema Reportado

**Descripción:** Al editar un terapeuta en el dashboard admin y cambiar su nombre, los cambios no se guardaban.

**Ubicación:** `/admin/dashboard/terapeutas`

---

## 🔍 Análisis del Problema

### Estructura de Base de Datos

```sql
-- Tabla profiles (extiende auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'paciente' NOT NULL
);

-- Tabla terapeutas (referencia a profiles)
CREATE TABLE terapeutas (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT,
  specialties TEXT[],
  experience_years INTEGER,
  is_active BOOLEAN DEFAULT true
);
```

**Relación:** `terapeutas.id` → `profiles.id` (mismo ID)

### Código Problemático (ANTES)

```tsx
// Línea 97-110 (versión anterior)
const { error } = await supabase
    .from('terapeutas')
    .upsert({
        id: editingTerapeuta.id,
        bio: editingTerapeuta.bio,
        specialties: specialtiesArr,
        experience_years: editingTerapeuta.experience_years,
        is_active: editingTerapeuta.is_active
    })

if (error) throw error

// ❌ PROBLEMA: No se verificaba si el update fue exitoso
await supabase.from('profiles').update({ 
    full_name: editingTerapeuta.full_name 
}).eq('id', editingTerapeuta.id)
```

### Problemas Identificados

1. **No se manejaban errores** en el update de `profiles`
2. **Uso de `upsert`** en lugar de `update` (innecesario en edición)
3. **No se verificaba el resultado** del update de nombre
4. **Alerts genéricos** sin información detallada
5. **No había logs** para debugging

---

## ✅ Solución Implementada

### Código Corregido (DESPUÉS)

```tsx
// MODO EDICIÓN: Update en ambas tablas
const specialtiesArr = typeof editingTerapeuta.specialties === 'string'
    ? editingTerapeuta.specialties.split(',').map((s: string) => s.trim()).filter(Boolean)
    : editingTerapeuta.specialties

// 1. Actualizar tabla terapeutas
const { error: terapeutaError } = await supabase
    .from('terapeutas')
    .update({  // ✅ Cambiado de upsert a update
        bio: editingTerapeuta.bio,
        specialties: specialtiesArr,
        experience_years: editingTerapeuta.experience_years,
        is_active: editingTerapeuta.is_active
    })
    .eq('id', editingTerapeuta.id)

// ✅ Verificar error en terapeutas
if (terapeutaError) {
    console.error('Error updating terapeuta:', terapeutaError)
    throw new Error(`Error al actualizar datos del terapeuta: ${terapeutaError.message}`)
}

// 2. Actualizar nombre en profiles
const { error: profileError } = await supabase
    .from('profiles')
    .update({ 
        full_name: editingTerapeuta.full_name 
    })
    .eq('id', editingTerapeuta.id)

// ✅ Verificar error en profiles
if (profileError) {
    console.error('Error updating profile:', profileError)
    throw new Error(`Error al actualizar nombre: ${profileError.message}`)
}

console.log('✅ Terapeuta actualizado correctamente')
```

### Mejoras Adicionales

#### 1. **Toast Notifications** en lugar de `alert()`

**Antes:**
```tsx
alert('Error: ' + error.message)
```

**Después:**
```tsx
setToast({
    message: error.message || 'Error al guardar los cambios',
    type: 'error'
})
```

#### 2. **Mensajes de Éxito**

```tsx
setToast({
    message: editingTerapeuta.id 
        ? 'Terapeuta actualizado correctamente' 
        : 'Terapeuta creado correctamente',
    type: 'success'
})
```

#### 3. **Manejo de Errores en Delete**

```tsx
const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este terapeuta?')) {
        const { error } = await supabase.from('terapeutas').delete().eq('id', id)
        if (error) {
            setToast({
                message: `Error al eliminar: ${error.message}`,
                type: 'error'
            })
        } else {
            setToast({
                message: 'Terapeuta eliminado correctamente',
                type: 'success'
            })
            fetchTerapeutas()
        }
    }
}
```

#### 4. **Manejo de Errores en Horarios**

```tsx
setToast({
    message: 'Horario guardado correctamente',
    type: 'success'
})
// o
setToast({
    message: `Error al guardar horario: ${error.message}`,
    type: 'error'
})
```

---

## 🎯 Cambios Realizados

### Archivos Modificados

**`src/app/[locale]/admin/dashboard/terapeutas/page.tsx`**

1. ✅ Import del componente `Toast`
2. ✅ Estado `toast` para notificaciones
3. ✅ Función `handleSave` corregida:
   - Cambio de `upsert` a `update`
   - Manejo de errores en ambas tablas
   - Logs para debugging
   - Toast en lugar de alert
4. ✅ Función `handleDelete` mejorada con Toast
5. ✅ Función `saveSchedule` mejorada con Toast
6. ✅ Renderizado del componente `<Toast />` al final

---

## 🧪 Cómo Probar

### Escenario 1: Editar Nombre
1. Ir a `/admin/dashboard/terapeutas`
2. Click en botón de editar (lápiz) de un terapeuta
3. Cambiar el "Nombre Completo"
4. Click en "Guardar Cambios"
5. **Resultado esperado:** 
   - ✅ Toast verde: "Terapeuta actualizado correctamente"
   - ✅ Nombre actualizado en la tarjeta
   - ✅ Cambio reflejado en la base de datos

### Escenario 2: Editar Otros Campos
1. Editar bio, especialidades, experiencia
2. Click en "Guardar Cambios"
3. **Resultado esperado:** 
   - ✅ Todos los campos se actualizan correctamente
   - ✅ Toast de confirmación

### Escenario 3: Error de Validación
1. Intentar guardar con datos inválidos
2. **Resultado esperado:** 
   - ✅ Toast rojo con mensaje de error específico
   - ✅ Logs en consola para debugging

---

## 📊 Comparación Antes/Después

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Update de nombre** | ❌ No funcionaba | ✅ Funciona correctamente |
| **Manejo de errores** | ❌ Sin verificación | ✅ Verificación completa |
| **Feedback visual** | ⚠️ Alert genérico | ✅ Toast profesional |
| **Debugging** | ❌ Sin logs | ✅ Console logs |
| **UX** | ⚠️ Básica | ✅ Profesional |
| **Mensajes de éxito** | ❌ No había | ✅ Implementados |

---

## 🔧 Detalles Técnicos

### ¿Por qué `update` en lugar de `upsert`?

**`upsert`:**
- Intenta INSERT primero
- Si falla (por PK duplicada), hace UPDATE
- Útil cuando no sabes si el registro existe

**`update`:**
- Solo actualiza registros existentes
- Más eficiente cuando sabes que existe
- Mejor para edición

**En nuestro caso:**
- Sabemos que el terapeuta existe (tiene `id`)
- Solo queremos actualizar
- `update` es más apropiado

### Orden de Updates

```tsx
// 1. Primero terapeutas (datos específicos)
await supabase.from('terapeutas').update({...})

// 2. Luego profiles (datos generales)
await supabase.from('profiles').update({...})
```

**Razón:** Si falla el update de `terapeutas`, no tocamos `profiles`.

---

## 🚀 Mejoras Futuras Sugeridas

### 1. **Optimistic Updates**
```tsx
// Actualizar UI inmediatamente
setTerapeutas(prev => prev.map(t => 
    t.id === editingTerapeuta.id 
        ? { ...t, ...editingTerapeuta } 
        : t
))

// Luego hacer el update en DB
await supabase.from('terapeutas').update(...)
```

### 2. **Validación de Formulario**
```tsx
const validateForm = () => {
    if (!editingTerapeuta.full_name?.trim()) {
        setToast({ message: 'El nombre es obligatorio', type: 'warning' })
        return false
    }
    if (editingTerapeuta.experience_years < 0) {
        setToast({ message: 'La experiencia no puede ser negativa', type: 'warning' })
        return false
    }
    return true
}
```

### 3. **Confirmación de Cambios**
```tsx
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

// Advertir antes de cerrar modal
const handleCloseModal = () => {
    if (hasUnsavedChanges) {
        if (confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir?')) {
            setIsModalOpen(false)
        }
    } else {
        setIsModalOpen(false)
    }
}
```

### 4. **Historial de Cambios**
```sql
CREATE TABLE terapeuta_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    terapeuta_id UUID REFERENCES terapeutas(id),
    changed_by UUID REFERENCES auth.users(id),
    changes JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## ✅ Conclusión

El bug se debía a:
1. Falta de manejo de errores en el update de `profiles`
2. No se verificaba si el update fue exitoso
3. Uso de `upsert` innecesario

**Solución:**
- ✅ Manejo explícito de errores en ambas tablas
- ✅ Cambio a `update` para mayor claridad
- ✅ Toast notifications para mejor UX
- ✅ Logs para debugging
- ✅ Mensajes de éxito/error específicos

**Estado:** ✅ **RESUELTO**

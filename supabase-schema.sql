-- 1. ENUMS Y EXTENSIONES
CREATE TYPE user_role AS ENUM ('admin', 'terapeuta', 'paciente');
CREATE TYPE session_status AS ENUM ('pending', 'paid', 'completed', 'cancelled');

-- 2. TABLA DE PERFILES (Extensión de auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'paciente' NOT NULL
);

-- 3. TABLA DE TERAPEUTAS
CREATE TABLE terapeutas (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  experience_years INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA DE SERVICIOS (Sesiones/Packs)
CREATE TABLE servicios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL, -- Siempre en céntimos
  duration_minutes INTEGER DEFAULT 50,
  is_pack BOOLEAN DEFAULT false,
  pack_quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLA DE SESIONES COMPRADAS
CREATE TABLE sesiones_compradas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  service_id UUID REFERENCES servicios(id) NOT NULL,
  terapeuta_id UUID REFERENCES terapeutas(id),
  stripe_session_id TEXT UNIQUE,
  status session_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABLA DE DISPONIBILIDAD SEMANAL
CREATE TABLE disponibilidad_semanal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  terapeuta_id UUID REFERENCES terapeutas(id) ON DELETE CASCADE NOT NULL,
  dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6),
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. SEGURIDAD (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE terapeutas ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones_compradas ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilidad_semanal ENABLE ROW LEVEL SECURITY;

-- 8. DISPARADORES (TRIGGERS) PARA PERFILES
-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'paciente')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que se dispara tras insertar en auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Políticas para Profiles
CREATE POLICY "Perfiles visibles por todos" ON profiles FOR SELECT USING (true);
CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para Terapeutas
CREATE POLICY "Terapeutas activos visibles por todos" ON terapeutas FOR SELECT USING (is_active = true);
CREATE POLICY "Admins pueden gestionar terapeutas" ON terapeutas FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para Servicios
CREATE POLICY "Servicios visibles por todos" ON servicios FOR SELECT USING (true);
CREATE POLICY "Solo admins gestionan servicios" ON servicios FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para Sesiones Compradas
CREATE POLICY "Usuarios ven sus propias compras" ON sesiones_compradas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins ven todas las compras" ON sesiones_compradas FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para Disponibilidad Semanal
CREATE POLICY "Disponibilidad visible por todos" ON disponibilidad_semanal FOR SELECT USING (true);
CREATE POLICY "Solo admins gestionan disponibilidad" ON disponibilidad_semanal FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 9. TABLA DE CITAS (Agendas)
CREATE TABLE citas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  terapeuta_id UUID REFERENCES terapeutas(id) NOT NULL,
  servicio_id UUID REFERENCES servicios(id) NOT NULL,
  fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_fin TIMESTAMP WITH TIME ZONE NOT NULL,
  status session_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE citas ENABLE ROW LEVEL SECURITY;

-- Políticas para Citas
CREATE POLICY "Usuarios ven sus propias citas" ON citas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Terapeutas ven sus propias citas" ON citas FOR SELECT USING (auth.uid() = terapeuta_id);
CREATE POLICY "Admins ven todas las citas" ON citas FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

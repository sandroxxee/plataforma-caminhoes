-- POLÍTICA DE SEGURANÇA PARA LIBERAR UPLOAD DE FOTOS NO BUCKET TRUCK-IMAGES PARA ADMINISTRADORES
-- Execute este script no SQL Editor do seu console do Supabase (https://supabase.com)

-- 1. Cria a política de controle total (ALL) para administradores no bucket 'truck-images'
CREATE POLICY "Permitir controle total no bucket truck-images para admins" 
ON storage.objects 
FOR ALL 
TO authenticated 
USING (
  bucket_id = 'truck-images' 
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  bucket_id = 'truck-images' 
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

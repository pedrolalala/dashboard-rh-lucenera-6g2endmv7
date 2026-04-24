CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.criar_usuario(p_email text, p_password text, p_nome text, p_role public.usuario_role DEFAULT 'viewer'::public.usuario_role)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_caller_role public.usuario_role;
  v_new_id      UUID;
BEGIN
  SELECT role INTO v_caller_role FROM public.usuarios WHERE id = auth.uid();
  IF v_caller_role != 'admin' THEN
    RAISE EXCEPTION 'Apenas administradores podem criar usuários.';
  END IF;
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RAISE EXCEPTION 'E-mail % já cadastrado.', p_email;
  END IF;

  v_new_id := gen_random_uuid();
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current, phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    v_new_id, '00000000-0000-0000-0000-000000000000', p_email,
    extensions.crypt(p_password, extensions.gen_salt('bf')), NOW(), NOW(), NOW(),
    '{"provider":"email","providers":["email"]}',
    json_build_object('nome', p_nome),
    false, 'authenticated', 'authenticated',
    '', '', '', '', '', NULL, '', '', ''
  );

  INSERT INTO public.usuarios (id, email, nome, role)
  VALUES (v_new_id, p_email, p_nome, p_role)
  ON CONFLICT (id) DO UPDATE SET nome = p_nome, role = p_role;

  RETURN v_new_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.admin_update_user_password(p_user_id uuid, p_new_password text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_caller_role public.usuario_role;
BEGIN
  SELECT role INTO v_caller_role FROM public.usuarios WHERE id = auth.uid();
  
  IF v_caller_role != 'admin' THEN
    RAISE EXCEPTION 'Apenas administradores podem alterar senhas.';
  END IF;

  UPDATE auth.users 
  SET encrypted_password = extensions.crypt(p_new_password, extensions.gen_salt('bf')),
      updated_at = NOW() 
  WHERE id = p_user_id;
END;
$function$;

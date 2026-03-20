-- 1. Create a secure fail-safe RPC for frontend self-healing
CREATE OR REPLACE FUNCTION public.link_my_funcionario_record()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_func_id uuid;
    v_user_email text;
    v_user_name text;
BEGIN
    -- Obter os dados do usuário autenticado atual
    SELECT email, raw_user_meta_data->>'name' INTO v_user_email, v_user_name
    FROM auth.users
    WHERE id = auth.uid();

    IF v_user_email IS NULL THEN
        RETURN NULL;
    END IF;

    -- Tentar encontrar um registro de funcionário existente por email e vinculá-lo
    UPDATE public.funcionarios_rh
    SET user_id = auth.uid()
    WHERE email = v_user_email AND user_id IS NULL
    RETURNING id INTO v_func_id;

    IF v_func_id IS NOT NULL THEN
        RETURN v_func_id;
    END IF;

    -- Verificar se já estava vinculado
    SELECT id INTO v_func_id FROM public.funcionarios_rh WHERE user_id = auth.uid();
    IF v_func_id IS NOT NULL THEN
        RETURN v_func_id;
    END IF;

    -- Se não existe de forma alguma, cria um novo registro garantindo o acesso
    INSERT INTO public.funcionarios_rh (nome, email, user_id, status)
    VALUES (
        COALESCE(v_user_name, split_part(v_user_email, '@', 1)),
        v_user_email,
        auth.uid(),
        'Ativo'
    )
    RETURNING id INTO v_func_id;

    RETURN v_func_id;
END;
$$;

-- 2. Update the auth trigger to automatically link new users upon registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    v_nome text;
BEGIN
    v_nome := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
    
    -- Inserir na tabela de permissões (usuarios)
    INSERT INTO public.usuarios (id, email, nome, role)
    VALUES (NEW.id, NEW.email, v_nome, 'viewer')
    ON CONFLICT (id) DO NOTHING;

    -- Tentar vincular um funcionário existente por email
    UPDATE public.funcionarios_rh
    SET user_id = NEW.id
    WHERE email = NEW.email AND user_id IS NULL;

    -- Se não encontrou/vinculou, criar um novo registro em funcionarios_rh
    IF NOT EXISTS (SELECT 1 FROM public.funcionarios_rh WHERE user_id = NEW.id) THEN
        INSERT INTO public.funcionarios_rh (nome, email, user_id, status)
        VALUES (v_nome, NEW.email, NEW.id, 'Ativo');
    END IF;

    RETURN NEW;
END;
$function$;

-- 3. Run a sync block immediately to fix any currently unlinked users
DO $$
DECLARE
    u RECORD;
    v_nome text;
BEGIN
    FOR u IN SELECT id, email, raw_user_meta_data FROM auth.users LOOP
        v_nome := COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1));

        UPDATE public.funcionarios_rh
        SET user_id = u.id
        WHERE email = u.email AND user_id IS NULL;
        
        IF NOT EXISTS (SELECT 1 FROM public.funcionarios_rh WHERE user_id = u.id) THEN
            INSERT INTO public.funcionarios_rh (nome, email, user_id, status)
            VALUES (v_nome, u.email, u.id, 'Ativo');
        END IF;
    END LOOP;
END $$;

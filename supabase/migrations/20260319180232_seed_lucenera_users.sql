-- Batch User Provisioning for Lucenera RH Dashboard
DO $$
DECLARE
    user_record RECORD;
    new_user_id UUID;
    usuarios_role TEXT;
    user_roles_role TEXT;
BEGIN
    FOR user_record IN 
        SELECT * FROM (VALUES 
            ('mariane@lucenera.com.br', 'Mariane', 'admin'),
            ('murillo@lucenera.com.br', 'Murillo', 'user'),
            ('tricia@lucenera.com.br', 'Tricia', 'user'),
            ('ketlyn@lucenera.com.br', 'Ketlyn', 'user'),
            ('adriana@lucenera.com.br', 'Adriana', 'user'),
            ('thairine@lucenera.com.br', 'Thairine', 'user'),
            ('vinicius@lucenera.com.br', 'Vinicius', 'admin'),
            ('Terezinha@lucenera.com.br', 'Terezinha', 'user'),
            ('giovana@lucenera.com.br', 'Giovana Gonella', 'user'),
            ('marina@lucenera.com.br', 'Marina', 'user'),
            ('giovanna.nori@lucenera.com.br', 'Giovanna Nori', 'user'),
            ('vitoria@lucenera.com.br', 'Vitoria', 'user'),
            ('matheus@lucenera.com.br', 'Matheus', 'user'),
            ('helena@lucenera.com.br', 'Helena', 'user'),
            ('filippo@lucenera.com.br', 'Filippo', 'admin'),
            ('alexandrecosta490@gmail.com', 'Alexandre', 'user'),
            ('isabella@lucenera.com.br', 'Isabella', 'user'),
            ('thais@lucenera.com.br', 'Thais', 'user'),
            ('pedro@lucenera.com.br', 'Pedro', 'admin'),
            ('moara@lucenera.com.br', 'Moara', 'user')
        ) AS t(email, nome, role)
    LOOP
        -- 1. Check if user already exists in auth.users
        SELECT id INTO new_user_id FROM auth.users WHERE email = user_record.email LIMIT 1;
        
        IF new_user_id IS NULL THEN
            new_user_id := gen_random_uuid();
            
            -- 2. Insert into auth.users safely complying with GoTrue requirements
            -- All token columns set to '' and phone set to NULL
            INSERT INTO auth.users (
                id, instance_id, email, encrypted_password, email_confirmed_at,
                created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
                is_super_admin, role, aud,
                confirmation_token, recovery_token, email_change_token_new,
                email_change, email_change_token_current,
                phone, phone_change, phone_change_token, reauthentication_token
            ) VALUES (
                new_user_id, '00000000-0000-0000-0000-000000000000', user_record.email,
                crypt('Lucenera2026!', gen_salt('bf')), NOW(),
                NOW(), NOW(), '{"provider": "email", "providers": ["email"]}',
                jsonb_build_object('name', user_record.nome),
                false, 'authenticated', 'authenticated',
                '', '', '', '', '', NULL, '', '', ''
            );
        END IF;

        -- 3. Determine role mappings based on rules
        IF user_record.role = 'admin' THEN
            usuarios_role := 'admin';
            user_roles_role := 'admin';
        ELSE
            usuarios_role := 'funcionario';
            user_roles_role := 'user';
        END IF;

        -- 4. Update or insert into public.usuarios
        -- Use ON CONFLICT to avoid duplication and safely override any default from handle_new_user() trigger
        INSERT INTO public.usuarios (id, email, nome, role)
        VALUES (new_user_id, user_record.email, user_record.nome, usuarios_role)
        ON CONFLICT (id) DO UPDATE 
        SET role = EXCLUDED.role, nome = EXCLUDED.nome;

        -- 5. Clean up old user_roles entry to prevent duplicates and insert the new correct one
        DELETE FROM public.user_roles WHERE user_id = new_user_id::text OR email = user_record.email;
        INSERT INTO public.user_roles (id, user_id, email, role, nome_completo, created_at, updated_at)
        VALUES (gen_random_uuid()::text, new_user_id::text, user_record.email, user_roles_role, user_record.nome, NOW(), NOW());

        -- 6. Ensure presence in public.funcionarios_rh to enable access to point control and evaluations
        IF NOT EXISTS (SELECT 1 FROM public.funcionarios_rh WHERE user_id = new_user_id) THEN
            INSERT INTO public.funcionarios_rh (
                nome, email, status, user_id
            ) VALUES (
                user_record.nome, user_record.email, 'Ativo', new_user_id
            );
        ELSE
            UPDATE public.funcionarios_rh
            SET nome = user_record.nome, email = user_record.email
            WHERE user_id = new_user_id;
        END IF;

    END LOOP;
END $$;

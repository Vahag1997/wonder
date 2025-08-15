'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Fieldset,
  Field,
  Input,
  InputGroup,
  Link,
  Text,
  VisuallyHidden,
  useToken,
} from '@chakra-ui/react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AuthForm({ onLogin, onSignup, isLoading = false }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [purple600] = useToken('colors', ['purple.600']);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });

  const [errors, setErrors] = useState({});

  const isSignup = mode === 'signup';

  const canSubmit = useMemo(() => {
    if (!form.email || !form.password) return false;
    if (isSignup && (!form.name || !form.confirm)) return false;
    return true;
  }, [form, isSignup]);

  function handleChange(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: null }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};

    if (!form.email) nextErrors.email = t("auth.emailRequired");
    if (!form.password) nextErrors.password = t("auth.passwordRequired");

    if (isSignup) {
      if (!form.name) nextErrors.name = t("auth.nameRequired");
      if (!form.confirm) nextErrors.confirm = t("auth.confirmPasswordRequired");
      if (form.password && form.confirm && form.password !== form.confirm) {
        nextErrors.confirm = t("auth.passwordsDoNotMatch");
      }
    }

    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    if (isSignup) {
      if (onSignup) await onSignup({ name: form.name, email: form.email, password: form.password });
    } else {
      if (onLogin) await onLogin({ email: form.email, password: form.password });
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      {/* Toggle */}
      <ButtonGroup size="sm" variant="ghost" mb={6}>
        <Button
          onClick={() => setMode('login')}
          color={mode === 'login' ? 'purple.600' : 'gray.600'}
          bg={mode === 'login' ? 'purple.50' : 'transparent'}
          _hover={{ bg: mode === 'login' ? 'purple.100' : 'gray.50' }}
          rounded="lg"
          disabled={isLoading}
        >
          {t("auth.logIn")}
        </Button>
        <Button
          onClick={() => setMode('signup')}
          color={mode === 'signup' ? 'purple.600' : 'gray.600'}
          bg={mode === 'signup' ? 'purple.50' : 'transparent'}
          _hover={{ bg: mode === 'signup' ? 'purple.100' : 'gray.50' }}
          rounded="lg"
          disabled={isLoading}
        >
          {t("auth.createAccount")}
        </Button>
      </ButtonGroup>

      <Fieldset.Root size="lg" maxW="full" spacing={6}>
        <Fieldset.Content>
          {isSignup && (
            <Field.Root invalid={!!errors.name}>
              <Field.Label color={"#312e2eff"}>{t("auth.name")}</Field.Label>
              <Input
                id="name"
                name="name"
                placeholder={t("auth.namePlaceholder")}
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                borderColor="gray.300"
                color={"#312e2eff"}
                _focus={{
                  borderColor: 'purple.500',
                  boxShadow: `0 0 0 1px ${purple600}`,
                }}
                disabled={isLoading}
              />
            </Field.Root>
          )}

          <Field.Root invalid={!!errors.email}>
            {/* <VisuallyHidden> */}
              <Field.Label color={"#312e2eff"}>{t("auth.email")}</Field.Label>
            {/* </VisuallyHidden> */}
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              borderColor="gray.300"
              color={"#312e2eff"}
              _focus={{
                borderColor: 'purple.500',
                boxShadow: `0 0 0 1px ${purple600}`,
              }}
              disabled={isLoading}
            />
            {errors.email && <Field.ErrorText>{errors.email}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            {/* <VisuallyHidden> */}
              <Field.Label color={"#312e2eff"}>{t("auth.password")}</Field.Label>
            {/* </VisuallyHidden> */}
            <InputGroup
              endElement={
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setShowPw((s) => !s)}
                  disabled={isLoading}
                >
                  {showPw ? t("auth.hide") : t("auth.show")}
                </Button>
              }
            >
              <Input
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                placeholder={isSignup ? t("auth.createPasswordPlaceholder") : t("auth.passwordPlaceholder")}
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                borderColor="gray.300"
                color={"#312e2eff"}
                _focus={{
                  borderColor: 'purple.500',
                  boxShadow: `0 0 0 1px ${purple600}`,
                }}
                disabled={isLoading}
              />
            </InputGroup>
            {errors.password && <Field.ErrorText>{errors.password}</Field.ErrorText>}
          </Field.Root>

          {isSignup && (
            <Field.Root invalid={!!errors.confirm}>
              <Field.Label color={"#312e2eff"}>{t("auth.confirmPassword")}</Field.Label>
              <InputGroup
                endElement={
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setShowPw2((s) => !s)}
                    disabled={isLoading}
                  >
                    {showPw2 ? t("auth.hide") : t("auth.show")}
                  </Button>
                }
              >
                <Input
                  id="confirm"
                  name="confirm"
                  type={showPw2 ? 'text' : 'password'}
                  placeholder={t("auth.confirmPasswordPlaceholder")}
                  value={form.confirm}
                  onChange={(e) => handleChange('confirm', e.target.value)}
                  borderColor="gray.300"
                  color={"#312e2eff"}
                  _focus={{
                    borderColor: 'purple.500',
                    boxShadow: `0 0 0 1px ${purple600}`,
                  }}
                  disabled={isLoading}
                />
              </InputGroup>
              {errors.confirm && <Field.ErrorText>{errors.confirm}</Field.ErrorText>}
            </Field.Root>
          )}
        </Fieldset.Content>

        <Flex align="center" justify="space-between" flexDir="column" gap={4} pt={2}>
          <Button
            type="submit"
            disabled={!canSubmit || isLoading}
            bg="#3e1779ff"
            _hover={{ bg: '#7a18d6ff' }}
            w="full"
            size="lg"
            isLoading={isLoading}
            loadingText={isSignup ? t("auth.creatingAccount") : t("auth.signingIn")}
          >
            <Text color="white">{isSignup ? t("auth.createAccount") : t("auth.logIn")}</Text>
          </Button>

          {mode === 'login' && (
            <Link
              href="#"
              fontSize="sm"
              color="purple.600"
              whiteSpace="nowrap"
              _hover={{ textDecoration: 'underline' }}
              disabled={isLoading}
            >
              {t("auth.forgotPassword")}
            </Link>
          )}
        </Flex>
      </Fieldset.Root>
    </Box>
  );
}

'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Box, Container, Heading, Text, Input, Button, VStack } from '@chakra-ui/react';

export default function ResetPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const onReset = async (e) => {
    e.preventDefault();
    setMsg(''); setErr('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined'
        ? `${window.location.origin}/account`
        : undefined,
    });
    if (error) setErr(error.message);
    else setMsg('If an account exists, a reset email has been sent.');
  };

  return (
    <Box bg="#faf5ff" minH="100dvh">
      <Container maxW="md" py={16}>
        <VStack spacing={6} bg="white" p={8} rounded="xl" shadow="sm" border="1px solid" borderColor="blackAlpha.100">
          <Heading size="lg">Reset password</Heading>
          <form onSubmit={onReset} style={{ width: '100%' }}>
            <VStack spacing={4} align="stretch">
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Button type="submit" colorScheme="purple">Send reset link</Button>
            </VStack>
          </form>
          {!!msg && <Text color="green.600">{msg}</Text>}
          {!!err && <Text color="red.600">{err}</Text>}
        </VStack>
      </Container>
    </Box>
  );
}

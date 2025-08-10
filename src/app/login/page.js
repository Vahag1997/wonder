"use client";

import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
} from "@chakra-ui/react";
import AuthForm from "./AuthForm";

export default function LoginPage() {
  return (
    <Flex
      minH="100dvh"
      align="center"
      justify="center"
      p={{ base: 4, sm: 6 }}
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        inset: 0,
        opacity: 0.35,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e9d5ff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
      }}
    >
      <Box
        position="relative"
        bg="white"
        rounded="2xl"
        shadow="xl"
        w="full"
        maxW="6xl"
        overflow="hidden"
        minH={{ base: "auto", md: "640px" }}
      >
        <Flex direction={{ base: "column", md: "row" }} h="100%">
          {/* LEFT — auth */}
          <Box
            w={{ base: "100%", md: "50%" }}
            p={{ base: 8, sm: 12 }}
            display="flex"
            flexDirection="column"
            h="100%"
            order={{ base: 1, md: 0 }}
          >
            {/* Logo */}
            <Box mb={10} color="purple.600">
              <Box
                as="svg"
                h="48px"
                w="48px"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <path d="M10 10 L 25 80 L 50 20 L 75 80 L 90 10 L 70 10 L 60 50 L 50 10 L 40 50 L 30 10 Z" />
              </Box>
            </Box>

            <Heading as="h1" size="xl" color="gray.800" mb={4}>
              Login to Account
            </Heading>
            <Text color="gray.600" mb={10}>
              Enter your credentials to access your account.
            </Text>

            {/* Auth form (handles login/signup toggle internally) */}
            <AuthForm
              onLogin={async ({ email, password }) => {
                // TODO: call your login API
                // await signIn(email, password)
              }}
              onSignup={async ({ name, email, password }) => {
                // TODO: call your signup API
                // await signUp(name, email, password)
              }}
            />
          </Box>

          {/* RIGHT — marketing / image */}
          <Flex
            w={{ base: "100%", md: "50%" }}
            align="center"
            justify="center"
            p={{ base: 6, md: 12 }}
            bgGradient="linear(to-br, purple.50, white)"
            textAlign="center"
            order={{ base: 2, md: 0 }}
          >
            <Box w="full" maxW={{ base: "22rem", sm: "28rem", md: "28rem" }}>
              <Heading size="xl" color="gray.800" mb={{ base: 6, md: 8 }}>
                Adored by millions worldwide
              </Heading>
              <Image
                alt="Abstract 3D 'W' logo with a futuristic image inside"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtuydCQTTsZtF7qTnkLZpJ6VpgO0oLu7L_mlb5_xXHBs2J8hTFIb8YvtxyPquE-hOemLJaQ2rpXrZaxq_dpmTuqaxfHWnzMj8YdnKFKVqpxx_rp8yyW7vQ2uNLidp_NPjfBXXkWK5DHylfmIFdFHtHAf9Uq2_WbPIyOzG7fQb2ODX6qAqpIu48-us99sEbliBWOqi515eBMkzfFS3qci1Mw0z2rDjBCst_S-nVcsovycxJajnJJ91mVOhZPaSShBMoNa7zDmg6FXE"
                w="100%"
                h="auto"
                rounded="lg"
                shadow="md"
              />
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}

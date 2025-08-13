'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, Flex, Image, Text, Heading } from '@chakra-ui/react';

const DEFAULT_PAIRS = [
  {
    identity_url:
      'https://storage.wonderwraps.com/c9f696fc-a817-44a9-87a1-45f96e13b030/qUl8juS5TDUP2gFBa9fYVTpU2IB6nZ-metaQ2hhcmxpZS5qcGc=-.jpg',
    artwork_url:
      'https://storage.wonderwraps.com/18827642-5c78-49fd-9bc8-3b740f178665/dsv9FAxZO4VNxrrZI8yK1vGoqAu14n-metaYWlfaW1hZ2UuanBlZw==-.jpeg',
  },
  {
    identity_url:
      'https://storage.wonderwraps.com/c94b3c35-fb0e-448f-85f1-3968004417b4/sRLuayulk8mSEEOpfXQGKgAKaAumsC-metaSTVyUzlmMURxZWxwQkM3eUpHdEhnNWV3bXVScW1uM2E0U0FhRGhpRS1wcmV2aWV3LmpwZw==-.jpg',
    artwork_url:
      'https://storage.wonderwraps.com/9c1c5eae-1770-42b9-96ec-0072b0d836be/LYTRfP8C5j8nZ5Wshz4norg4IfQKGH-metaYWlfaW1hZ2UgKDEpLmpwZWc=-.jpeg',
  },
  {
    identity_url:
      'https://storage.wonderwraps.com/09e96f12-f7d1-48d3-8ba5-24b528c98e16/iyzbgYw3ox8YwgNJDRYvZ4zzffZHIA-metaVGhlby5qcGc=-.jpg',
    artwork_url:
      'https://storage.wonderwraps.com/6eeca8a8-3a46-4995-bb9a-d97bfdaa8dad/kYlYjXM9qyld2nhVqtkjoFMsYzkWgj-metaVGhlby5wbmc=-.png',
  },
  {
    identity_url:
      'https://storage.wonderwraps.com/f9a1516b-670b-4018-adb0-76b89e7f99ac/2ii4qGLXmYbewYkPgUDxINvarDAU3d-metaSmFtZXMuanBn-.jpg',
    artwork_url:
      'https://storage.wonderwraps.com/0707e8b3-ecd7-43d5-9bd7-8678e99b371a/EmQKu5WF25s0bDzekEnErUZJwJuKlJ-metaSmFtZXMxLmpwZWc=-.jpeg',
  },
];

export default function PersonalisedShowcase({ pairs, intervalMs = 5000 }) {
  const data = useMemo(() => (pairs && pairs.length ? pairs : DEFAULT_PAIRS), [pairs]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!data.length) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % data.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [data.length, intervalMs]);

  const current = data[index];

  return (
    <Box
      px={{ base: 6, md: 8 }}
      pt={{ base: 10, md: 12 }}
      h="full"
      minH="520px"
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(317.92deg, rgba(197,105,255,0.3) 2.92%, rgba(255,255,255,0.3) 55.83%)"
      borderRadius="xl"
    >
      <Box textAlign="center" mb={2}>
        <Text fontSize="xs" fontWeight="black" color="purple.600" letterSpacing="0.08em">
          HOW OTHERS PERSONALISED THEIR STORIES
        </Text>
        <Heading as="h2" size="lg" mt={2} lineHeight="1.15" fontFamily="'Marcellus', serif">
          Adored by <br /> millions worldwide
        </Heading>
      </Box>

      <Flex mt={8} align="center" gap={{ base: 8, md: 12 }} position="relative">
        {/* Left — circular identity image */}
        <Box position="relative" w={{ base: '28', md: '36' }} h={{ base: '28', md: '36' }} flexShrink={0} mt={{ base: 20, md: 32 }}>
          {current && (
            <Image
              src={current.identity_url}
              alt="Identity Image"
              w="100%"
              h="100%"
              objectFit="cover"
              borderRadius="full"
            />
          )}

          {/* Decorative SVG */}
          <Box
            position="absolute"
            top={{ base: '-20', md: '-28' }}
            right={{ base: '-10', md: '-14' }}
            w={{ base: '28', md: '36' }}
            h={{ base: '28', md: '36' }}
            zIndex={10}
          >
            <svg viewBox="0 0 113 112" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M43.4022 52.3076C42.4085 51.9881 41.7313 51.4496 40.8414 52.3401C37.2081 55.983 34.7371 60.283 33.2731 65.1907C32.5052 67.7651 34.6428 70.1531 37.2119 69.5582C38.1997 69.3297 39.1944 69.0532 40.0883 68.5185C45.4049 65.3405 46.5049 60.366 45.363 54.8201C45.132 53.6941 44.4204 52.6827 43.4022 52.3076ZM102.944 40.369C97.9366 39.4253 93.2916 38.9305 88.6551 38.5273C80.4313 37.8145 72.2455 38.2891 64.2011 40.5039C60.0206 41.6546 55.8667 42.892 51.9721 44.8086C49.4863 46.0304 46.9429 47.2109 44.7302 48.9378C44.3403 49.2408 43.5155 49.5763 44.4432 50.2383C47.5378 52.4529 47.9013 55.8223 48.0994 59.2366C48.2476 61.7805 47.8437 64.361 46.5041 66.4515C44.858 69.0173 42.496 71.0355 39.396 71.7658C38.5574 71.9645 37.8328 72.3987 36.9122 72.4862C33.0274 72.8569 29.3966 66.6337 31.2684 62.6238C32.9983 58.9133 34.7975 55.2716 37.379 52.0698C37.5039 51.9161 37.6587 51.7947 37.5367 51.4091C35.2745 51.5241 32.9999 51.8138 30.727 52.2463C25.5886 53.2256 20.8211 55.2252 16.3906 57.9289C12.4848 60.3109 9.097 63.402 7.00055 67.5805C6.04562 69.4837 5.59329 71.6409 5.50628 73.8049C5.43989 75.4502 5.49683 77.0989 5.50644 78.7474C5.50652 78.926 5.65354 79.1585 5.39678 79.2316C5.2309 79.2779 4.9891 79.2492 4.84572 79.1587C4.56075 78.9737 4.39041 78.6975 4.26867 78.3471C2.43378 73.0674 3.14996 68.1529 6.33671 63.5425C9.77191 58.5665 14.6008 55.3835 19.9333 52.9207C26.162 50.0469 32.6781 48.4182 39.5848 48.9173C40.111 48.9569 40.4896 48.8371 40.9034 48.4873C45.3927 44.7172 50.5729 42.2413 55.9768 40.1178C61.2501 38.0466 66.7104 36.7216 72.2468 35.8256C76.8201 35.0878 81.4774 35.0648 86.1166 35.3369C92.1019 35.6888 98.0001 36.6528 103.892 37.67C104.975 37.8566 105.035 37.875 106.18 37.6013C104.257 36.434 102.488 35.2888 100.649 34.2686C98.1811 32.8957 95.8812 31.2684 93.5267 29.7255C92.7049 29.1885 91.8834 28.6547 90.9475 28.3687C90.0144 28.0839 89.639 27.4204 89.5261 26.5348C89.3768 25.3812 89.9886 24.8733 91.1069 25.2686C93.3334 26.0533 95.2559 27.4149 97.2076 28.6857C100.797 31.0262 104.44 33.2584 108.242 35.2353C108.872 35.5617 109.57 35.822 109.978 36.4956C110.786 37.8255 110.512 38.5222 109.262 39.4213C107.085 40.99 105.03 42.7342 102.896 44.3698C100.578 46.1444 98.2524 47.9026 96.1882 49.9838C95.6208 50.5559 94.7986 50.8497 94.2171 50.3343C93.541 49.7325 93.6987 48.8357 94.2091 48.0597C95.6528 45.8733 97.9356 44.6351 99.8527 42.9833C100.796 42.1689 101.756 41.3733 102.941 40.3724"
                fill="#C569FF"
              />
            </svg>
          </Box>
        </Box>

        {/* Right — rotated artwork card */}
        <Box
          w="300px"
          h="300px"
          borderRadius="lg"
          overflow="hidden"
          mt={6}
          transform="rotate(6deg)"
        >
          {current && (
            <Image
              src={current.artwork_url}
              alt="Artwork Image"
              w="100%"
              h="100%"
              objectFit="contain"
            />
          )}
        </Box>
      </Flex>
    </Box>
  );
}

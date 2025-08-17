'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  SimpleGrid, 
  VStack, 
  HStack, 
  Button, 
  Icon, 
  Text, 
  Flex, 
  Spinner, 
  Center, 
  Card,
  Image,
  Badge,
  useDisclosure,
  Dialog,
  Portal,
  Separator,
  Container
} from '@chakra-ui/react';
import { 
  FaBook, 
  FaDownload, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle,
  FaHeart,
  FaShare,
  FaPrint,
  FaTimes,
  FaPlus
} from 'react-icons/fa';
import { getMyBooks } from '../../lib/api';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import BottomBanner from '../componets/BottomBanner';
import { useLanguage } from '../../contexts/LanguageContext';

export default function MyBooksPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const data = await getMyBooks();
      setBooks(data || []);
    } catch (err) {
      console.error('Error fetching my books:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in_progress': return 'blue';
      case 'pending': return 'yellow';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return FaCheckCircle;
      case 'in_progress': return FaClock;
      case 'pending': return FaClock;
      case 'failed': return FaExclamationTriangle;
      default: return FaClock;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return t("myBooks.completed");
      case 'in_progress': return t("myBooks.inProgress");
      case 'pending': return t("myBooks.pending");
      case 'failed': return t("myBooks.failed");
      default: return status?.replace('_', ' ');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setDialogOpen(true);
  };

  const handleDownload = (book) => {
    if (book.file_url) {
      window.open(book.file_url, '_blank');
    }
  };

  const handleEdit = (book) => {
    // Navigate to edit page or open edit modal
    console.log('Edit book:', book.id);
  };

  const handleDelete = (book) => {
    // Handle delete confirmation
    console.log('Delete book:', book.id);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Container maxW="8xl" px={{ base: 4, md: 8 }} py={{ base: 8, md: 12 }}>
          <Center py={{ base: 16, md: 24 }}>
            <VStack spacing={6}>
              <Spinner size="xl" color="purple.600" thickness="4px" />
              <Text fontSize="lg" color="gray.600" fontWeight="medium">
                {t("myBooks.loading")}
              </Text>
            </VStack>
          </Center>
        </Container>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Container maxW="8xl" px={{ base: 4, md: 8 }} py={{ base: 8, md: 12 }}>
          <Center py={{ base: 16, md: 24 }}>
            <VStack spacing={6}>
              <Icon as={FaExclamationTriangle} boxSize={12} color="red.500" />
              <VStack spacing={2}>
                <Text fontSize="lg" color="red.600" fontWeight="semibold">
                  {t("myBooks.error")}
                </Text>
                <Text fontSize="md" color="gray.600" textAlign="center">
                  {error}
                </Text>
              </VStack>
              <Button 
                onClick={fetchMyBooks} 
                colorScheme="purple" 
                size="lg"
                leftIcon={<Icon as={FaBook} />}
              >
                {t("myBooks.tryAgain")}
              </Button>
            </VStack>
          </Center>
        </Container>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Container maxW="8xl" px={{ base: 4, md: 8 }} py={{ base: 8, md: 12 }}>
        {/* Header Section */}
        <VStack align="start" spacing={{ base: 4, md: 6 }} mb={{ base: 8, md: 12 }}>
          <Flex 
            w="full" 
            justify="space-between" 
            align={{ base: "start", md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={{ base: 4, md: 0 }}
          >
            <VStack align="start" spacing={3}>
              <Heading 
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} 
                color="purple.600"
                fontWeight="bold"
                lineHeight="shorter"
              >
                {t("myBooks.title")}
              </Heading>
              <Text 
                fontSize="md" 
                color="gray.600"
                fontWeight="medium"
              >
                {books.length} {books.length === 1 ? t("myBooks.subtitle") : t("myBooks.subtitlePlural")}
              </Text>
            </VStack>
            
            <Button
              colorScheme="purple"
              size="lg"
              leftIcon={<Icon as={FaPlus} boxSize={{ base: 5, md: 4 }} />}
              onClick={() => router.push('/books')}
              borderRadius="full"
              px={8}
              py={4}
              fontSize="md"
              fontWeight="semibold"
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              transition="all 0.3s"
            >
              {t("myBooks.createNewBook")}
            </Button>
          </Flex>
        </VStack>

        {/* Books Grid */}
        {books.length === 0 ? (
          <Center py={{ base: 16, md: 24 }}>
            <VStack spacing={8} textAlign="center">
              <Box
                w="100px"
                h="100px"
                borderRadius="full"
                bg="purple.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaBook} boxSize={10} color="purple.600" />
              </Box>
              <VStack spacing={4}>
                <Heading 
                  fontSize={{ base: "xl", md: "2xl" }} 
                  color="gray.700"
                  fontWeight="bold"
                >
                  {t("myBooks.noBooks")}
                </Heading>
                <Text 
                  fontSize="md" 
                  color="gray.500" 
                  maxW="500px"
                  lineHeight="tall"
                >
                  {t("myBooks.noBooksDescription")}
                </Text>
              </VStack>
              <Button 
                colorScheme="purple" 
                size="lg"
                leftIcon={<Icon as={FaPlus} boxSize={{ base: 5, md: 4 }} />}
                onClick={() => router.push('/books')}
                borderRadius="full"
                px={8}
                py={4}
                fontSize="md"
                fontWeight="semibold"
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                transition="all 0.3s"
              >
                {t("myBooks.createFirstBook")}
              </Button>
            </VStack>
          </Center>
        ) : (
          <SimpleGrid 
            columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} 
            gap={{ base: 6, md: 8 }}
            spacing={{ base: 6, md: 8 }}
          >
            {books.map((book) => (
              <Card.Root 
                key={book.id} 
                cursor="pointer" 
                transition="all 0.3s ease"
                _hover={{ 
                  transform: 'translateY(-8px)', 
                  shadow: '2xl',
                  borderColor: 'purple.300'
                }}
                border="2px solid"
                borderColor="transparent"
                borderRadius="xl"
                overflow="hidden"
                bg="white"
                onClick={() => handleBookClick(book)}
                position="relative"
                group
              >
                <Card.Body p={0}>
                  {/* Book Image */}
                  <Box position="relative">
                    <Image
                      src={book.product?.preview_url || '/placeholder-book.jpg'}
                      alt={book.product?.title || t("myBooks.untitledBook")}
                      w="full"
                      h={{ base: "144px", md: "176px" }}
                      objectFit="cover"
                      transition="transform 0.3s ease"
                      _groupHover={{ transform: 'scale(1.05)' }}
                    />
                    
                    {/* Status Badge */}
                    <Badge
                      position="absolute"
                      top={3}
                      right={3}
                      colorScheme={getStatusColor(book.status)}
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontSize="xs"
                      fontWeight="bold"
                      boxShadow="md"
                    >
                      <HStack spacing={1}>
                        <Icon as={getStatusIcon(book.status)} boxSize={3} />
                        <Text>{getStatusText(book.status)}</Text>
                      </HStack>
                    </Badge>

                    {/* Hover Action Buttons */}
                    <Box
                      position="absolute"
                      bottom={3}
                      right={3}
                      opacity={0}
                      transition="opacity 0.3s ease"
                      _groupHover={{ opacity: 1 }}
                    >
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          colorScheme="purple"
                          borderRadius="full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(book);
                          }}
                          _hover={{ transform: 'scale(1.1)' }}
                          transition="transform 0.2s ease"
                        >
                          <Icon as={FaDownload} boxSize={4} />
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          borderRadius="full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(book);
                          }}
                          _hover={{ transform: 'scale(1.1)' }}
                          transition="transform 0.2s ease"
                        >
                          <Icon as={FaEdit} boxSize={4} />
                        </Button>
                      </HStack>
                    </Box>
                  </Box>

                  {/* Book Info */}
                  <Box p={{ base: 3, md: 5 }}>
                    <VStack align="start" spacing={3}>
                      <Text 
                        fontSize="lg" 
                        fontWeight="bold" 
                        color="gray.800"
                        noOfLines={2}
                        lineHeight="short"
                      >
                        {book.product?.title || t("myBooks.untitledBook")}
                      </Text>
                      
                      <Text 
                        fontSize="sm" 
                        color="gray.600"
                        noOfLines={2}
                        lineHeight="tall"
                      >
                        {t("myBooks.personalizedForChild")}
                      </Text>

                      <HStack justify="space-between" w="full" pt={1}>
                        <Text 
                          fontSize="xs" 
                          color="gray.500"
                          fontWeight="medium"
                        >
                          {t("myBooks.created")} {formatDate(book.created_at)}
                        </Text>
                        
                        <HStack spacing={2}>
                          <Button
                            size="sm"
                            colorScheme="purple"
                            variant="ghost"
                            borderRadius="full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(book);
                            }}
                            _hover={{ bg: 'purple.50' }}
                          >
                            <Icon as={FaDownload} boxSize={4} />
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            variant="ghost"
                            borderRadius="full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(book);
                            }}
                            _hover={{ bg: 'blue.50' }}
                          >
                            <Icon as={FaEdit} boxSize={4} />
                          </Button>
                        </HStack>
                      </HStack>
                    </VStack>
                  </Box>
                </Card.Body>
              </Card.Root>
            ))}
          </SimpleGrid>
        )}

        {/* Book Detail Dialog */}
        <Dialog.Root open={dialogOpen} onOpenChange={(e) => setDialogOpen(e.open)}>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content maxW={{ base: "95vw", md: "4xl" }} maxH="90vh" overflow="hidden">
                <Dialog.Header borderBottom="1px solid" borderColor="gray.200" pb={4}>
                  <Dialog.Title fontSize="xl" fontWeight="bold" color="purple.600">
                    {t("myBooks.bookDetails")}
                  </Dialog.Title>
                  <Dialog.CloseTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="lg"
                      borderRadius="full"
                      _hover={{ bg: 'gray.100' }}
                    >
                      <Icon as={FaTimes} boxSize={5} />
                    </Button>
                  </Dialog.CloseTrigger>
                </Dialog.Header>
                <Dialog.Body p={0} maxH="calc(90vh - 80px)" overflowY="auto">
                  {selectedBook && (
                    <Box p={{ base: 4, md: 6 }}>
                      <VStack spacing={6} align="start">
                        {/* Book Image and Basic Info */}
                        <Flex 
                          direction={{ base: 'column', md: 'row' }} 
                          gap={6} 
                          w="full"
                        >
                          <Image
                            src={selectedBook.product?.preview_url || '/placeholder-book.jpg'}
                            alt={selectedBook.product?.title || t("myBooks.untitledBook")}
                            w={{ base: 'full', md: '250px' }}
                            h={{ base: '200px', md: '300px' }}
                            objectFit="cover"
                            borderRadius="xl"
                            flexShrink={0}
                            shadow="lg"
                          />
                          
                          <VStack align="start" spacing={4} flex={1}>
                            <VStack align="start" spacing={3}>
                              <Heading size="lg" color="purple.600" fontWeight="bold">
                                {selectedBook.product?.title || t("myBooks.untitledBook")}
                              </Heading>
                              <Badge
                                colorScheme={getStatusColor(selectedBook.status)}
                                borderRadius="full"
                                px={3}
                                py={1}
                                fontSize="sm"
                                fontWeight="bold"
                              >
                                <HStack spacing={2}>
                                  <Icon as={getStatusIcon(selectedBook.status)} boxSize={4} />
                                  <Text>{getStatusText(selectedBook.status)}</Text>
                                </HStack>
                              </Badge>
                            </VStack>

                            <VStack align="start" spacing={3}>
                              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                <strong>{t("myBooks.created")}</strong> {formatDate(selectedBook.created_at)}
                              </Text>
                              {selectedBook.updated_at && (
                                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                  <strong>{t("myBooks.lastUpdated")}</strong> {formatDate(selectedBook.updated_at)}
                                </Text>
                              )}
                              {selectedBook.product?.languages && (
                                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                  <strong>{t("myBooks.languages")}</strong> {selectedBook.product.languages.join(', ')}
                                </Text>
                              )}
                            </VStack>
                          </VStack>
                        </Flex>

                        <Separator />

                        {/* Action Buttons */}
                        <VStack spacing={4} w="full">
                          <Text fontSize="md" fontWeight="bold" color="gray.700" alignSelf="start">
                            {t("myBooks.actions")}
                          </Text>
                          <HStack 
                            spacing={4} 
                            w="full" 
                            justify={{ base: "center", md: "start" }}
                            flexWrap="wrap"
                          >
                            <Button
                              leftIcon={<Icon as={FaDownload} />}
                              colorScheme="purple"
                              size="lg"
                              onClick={() => handleDownload(selectedBook)}
                              isDisabled={!selectedBook.file_url}
                              borderRadius="full"
                              px={6}
                              py={3}
                              fontSize="md"
                              fontWeight="semibold"
                              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                              transition="all 0.3s"
                            >
                              {t("myBooks.downloadPdf")}
                            </Button>
                            <Button
                              leftIcon={<Icon as={FaPrint} />}
                              colorScheme="blue"
                              size="lg"
                              variant="outline"
                              borderRadius="full"
                              px={6}
                              py={3}
                              fontSize="md"
                              fontWeight="semibold"
                              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                              transition="all 0.3s"
                            >
                              {t("myBooks.printBook")}
                            </Button>
                            <Button
                              leftIcon={<Icon as={FaShare} />}
                              colorScheme="green"
                              size="lg"
                              variant="outline"
                              borderRadius="full"
                              px={6}
                              py={3}
                              fontSize="md"
                              fontWeight="semibold"
                              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                              transition="all 0.3s"
                            >
                              {t("myBooks.share")}
                            </Button>
                          </HStack>
                        </VStack>

                        {/* Personalization Data */}
                        {selectedBook.data && (
                          <>
                            <Separator />
                            <VStack align="start" spacing={4} w="full">
                              <Heading size="sm" color="gray.700" fontWeight="bold">
                                {t("myBooks.personalizationDetails")}
                              </Heading>
                              <Box 
                                p={6} 
                                bg="gray.50" 
                                borderRadius="xl" 
                                w="full"
                                maxH="300px"
                                overflowY="auto"
                                border="1px solid"
                                borderColor="gray.200"
                              >
                                <Text fontSize="sm" fontFamily="mono" color="gray.600" lineHeight="tall">
                                  {JSON.stringify(selectedBook.data, null, 2)}
                                </Text>
                              </Box>
                            </VStack>
                          </>
                        )}
                      </VStack>
                    </Box>
                  )}
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Container>
      <BottomBanner/>
    </ProtectedRoute>
  );
}

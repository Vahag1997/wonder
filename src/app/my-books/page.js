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
  Separator
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
  FaTimes
} from 'react-icons/fa';
import { getMyBooks } from '../../lib/api';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import BottomBanner from '../componets/BottomBanner';
export default function MyBooksPage() {
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
        <Box px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }}>
          <Center py={20}>
            <VStack spacing={4}>
              <Spinner size="xl" color="purple.600" thickness="4px" />
              <Text fontSize="lg" color="gray.600">Loading your personalized books...</Text>
            </VStack>
          </Center>
        </Box>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Box px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }}>
          <Center py={20}>
            <VStack spacing={4}>
              <Icon as={FaExclamationTriangle} boxSize={12} color="red.500" />
              <Text fontSize="lg" color="red.600">Error loading books: {error}</Text>
              <Button onClick={fetchMyBooks} colorScheme="purple">
                Try Again
              </Button>
            </VStack>
          </Center>
        </Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Box px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }}>
        {/* Header */}
        <VStack align="start" spacing={{ base: 4, md: 6 }} mb={{ base: 6, md: 8 }}>
                   <Flex 
             w="full" 
             justify="start" 
             align="start"
             direction="column"
             gap={4}
           >
                       <VStack align="start" spacing={2}>
               <Heading fontSize={{ base: "2xl", md: "3xl" }} color="purple.600">
                 My Personalized Books
               </Heading>
               <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
                 {books.length} personalized book{books.length !== 1 ? 's' : ''} in your library
               </Text>
             </VStack>
          </Flex>
        </VStack>

        {/* Books Grid */}
        {books.length === 0 ? (
          <Center py={20}>
            <VStack spacing={6}>
              <Icon as={FaBook} boxSize={16} color="gray.400" />
              <VStack spacing={2}>
                <Text fontSize="xl" fontWeight="medium" color="gray.600">
                  No personalized books yet
                </Text>
                <Text fontSize="md" color="gray.500" textAlign="center">
                  Start creating your first personalized book to see it here
                </Text>
              </VStack>
                           <Button 
                 colorScheme="purple" 
                 size="lg"
                 onClick={() => router.push('/books')}
               >
                 Create Your First Book
               </Button>
            </VStack>
          </Center>
        ) : (
          <SimpleGrid 
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
            gap={{ base: 6, md: 8 }}
          >
            {books.map((book) => (
                           <Card.Root 
                 key={book.id} 
                 cursor="pointer" 
                 transition="all 0.3s"
                 _hover={{ 
                   transform: 'translateY(-4px)', 
                   shadow: 'xl',
                   borderColor: 'purple.200'
                 }}
                 border="2px solid"
                 borderColor="transparent"
                 onClick={() => handleBookClick(book)}
               >
                 <Card.Body p={0}>
                  {/* Book Image */}
                  <Box position="relative">
                    <Image
                      src={book.product?.preview_url || '/placeholder-book.jpg'}
                      alt={book.product?.title || 'Book cover'}
                      w="full"
                      h="200px"
                      objectFit="cover"
                      borderTopRadius="md"
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
                    >
                      <HStack spacing={1}>
                        <Icon as={getStatusIcon(book.status)} boxSize={3} />
                        <Text>{book.status?.replace('_', ' ')}</Text>
                      </HStack>
                    </Badge>

                    {/* Action Buttons */}
                    <Box
                      position="absolute"
                      bottom={3}
                      right={3}
                      opacity={0}
                      transition="opacity 0.3s"
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
                        >
                          <Icon as={FaDownload} boxSize={3} />
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          borderRadius="full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(book);
                          }}
                        >
                          <Icon as={FaEdit} boxSize={3} />
                        </Button>
                      </HStack>
                    </Box>
                  </Box>

                  {/* Book Info */}
                  <Box p={4}>
                    <VStack align="start" spacing={3}>
                      <Text 
                        fontSize={{ base: "md", md: "lg" }} 
                        fontWeight="bold" 
                        color="gray.800"
                        noOfLines={2}
                      >
                        {book.product?.title || 'Untitled Book'}
                      </Text>
                      
                      <Text 
                        fontSize="sm" 
                        color="gray.600"
                        noOfLines={2}
                      >
                        Personalized for your child
                      </Text>

                      <HStack justify="space-between" w="full">
                        <Text fontSize="xs" color="gray.500">
                          Created {formatDate(book.created_at)}
                        </Text>
                        
                        <HStack spacing={2}>
                          <Button
                            size="xs"
                            colorScheme="purple"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(book);
                            }}
                          >
                            <Icon as={FaDownload} boxSize={3} />
                          </Button>
                          <Button
                            size="xs"
                            colorScheme="blue"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(book);
                            }}
                          >
                            <Icon as={FaEdit} boxSize={3} />
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
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Book Details</Dialog.Title>
                    <Dialog.CloseTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Icon as={FaTimes} />
                      </Button>
                    </Dialog.CloseTrigger>
                  </Dialog.Header>
                  <Dialog.Body>
              {selectedBook && (
                <VStack spacing={6} align="start">
                  {/* Book Image and Basic Info */}
                  <Flex 
                    direction={{ base: 'column', md: 'row' }} 
                    gap={6} 
                    w="full"
                  >
                    <Image
                      src={selectedBook.product?.preview_url || '/placeholder-book.jpg'}
                      alt={selectedBook.product?.title || 'Book cover'}
                      w={{ base: 'full', md: '200px' }}
                      h="250px"
                      objectFit="cover"
                      borderRadius="md"
                      flexShrink={0}
                    />
                    
                    <VStack align="start" spacing={4} flex={1}>
                      <VStack align="start" spacing={2}>
                        <Heading size="md" color="purple.600">
                          {selectedBook.product?.title || 'Untitled Book'}
                        </Heading>
                        <Badge
                          colorScheme={getStatusColor(selectedBook.status)}
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          <HStack spacing={2}>
                            <Icon as={getStatusIcon(selectedBook.status)} boxSize={4} />
                            <Text>{selectedBook.status?.replace('_', ' ')}</Text>
                          </HStack>
                        </Badge>
                      </VStack>

                      <VStack align="start" spacing={2}>
                        <Text fontSize="sm" color="gray.600">
                          <strong>Created:</strong> {formatDate(selectedBook.created_at)}
                        </Text>
                        {selectedBook.updated_at && (
                          <Text fontSize="sm" color="gray.600">
                            <strong>Last updated:</strong> {formatDate(selectedBook.updated_at)}
                          </Text>
                        )}
                        {selectedBook.product?.languages && (
                          <Text fontSize="sm" color="gray.600">
                            <strong>Languages:</strong> {selectedBook.product.languages.join(', ')}
                          </Text>
                        )}
                      </VStack>
                    </VStack>
                  </Flex>

                  <Separator />

                  {/* Action Buttons */}
                  <HStack spacing={4} w="full" justify="center">
                    <Button
                      leftIcon={<Icon as={FaDownload} />}
                      colorScheme="purple"
                      size="lg"
                      onClick={() => handleDownload(selectedBook)}
                      isDisabled={!selectedBook.file_url}
                    >
                      Download PDF
                    </Button>
                    <Button
                      leftIcon={<Icon as={FaPrint} />}
                      colorScheme="blue"
                      size="lg"
                      variant="outline"
                    >
                      Print Book
                    </Button>
                    <Button
                      leftIcon={<Icon as={FaShare} />}
                      colorScheme="green"
                      size="lg"
                      variant="outline"
                    >
                      Share
                    </Button>
                  </HStack>

                  {/* Personalization Data */}
                  {selectedBook.data && (
                    <>
                      <Separator />
                      <VStack align="start" spacing={3} w="full">
                        <Heading size="sm" color="gray.700">
                          Personalization Details
                        </Heading>
                        <Box 
                          p={4} 
                          bg="gray.50" 
                          borderRadius="md" 
                          w="full"
                          maxH="200px"
                          overflowY="auto"
                        >
                          <Text fontSize="sm" fontFamily="mono" color="gray.600">
                            {JSON.stringify(selectedBook.data, null, 2)}
                          </Text>
                        </Box>
                      </VStack>
                    </>
                  )}
                                                           </VStack>
                )}
                  </Dialog.Body>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
      </Box>
      <BottomBanner/>
    </ProtectedRoute>
  );
}

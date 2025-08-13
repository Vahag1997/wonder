// lib/books.js

export const allBooks = [
  {
    slug: 'boy-explores-the-world-of-jobs',
    title: 'Boy Explores the World of Jobs',
    gender: 'Boy',
    ageRange: ['4-6', '6-8'],
    price: 39.99,
    oldPrice: 50.0,
    rating: 4.8,
    ratingCount: 2453,
    cover:
      "https://storage.wonderwraps.com/bbda3658-3e23-414d-838e-47348a8858ea/responsive-images/Zp1Egf20Hs9VQD7B9TIbtLyqAZtjyC-metaY292ZXIucG5n-___media_library_original_550_550.png",
    description:
      'Join a curious boy on a playful adventure to discover the amazing jobs that make our world work. What will you be when you grow up?',
    gallery: {
      thumbs: [
        {
          type: 'video',
          src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLzg5kJS0XFWKPfkwduWBk7Nhjii_afyi12oPnTwCMby5G-8_wZFKLEyJ_gqjQJhhsCZWDULEhjkVCTEX5tZKKWLhIbDHi4JldjN-Ia7tw4H1ns7-R9B68f4GrmlnoffMg0zhwXlwzpNpdm4dFD-l2b7IyDkRKgELXHZvlqw0I97Ipug1AgDvvOMYpfyYYqxC53GV1J77sSTDGK4hVktCFgYiz1mU1wvL9rTUl9rYrw3Oc7FDN3l0_b1xeMC6AXdNnXMfZ8AJKLEGs',
        },
        {
          type: 'image',
          src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnRRVFc4qKyERP0aTQZ4NoCgVuBXJN7s-A9vCIsR2fWmQisqIrYMaRY4YaBd2EZ2AalhNq0QPDX-Yq3zxAB50aKGsxyywmcHoTpwPaPWQwJ3oj27eQmTLdyi_lmdipWs8JOyeS3FATIrLeN0dk8-LEs72AOcq4KyNWgqbdr9P7koDgD-ESjnahGQVcBnEIpvaTn3DEb-6ZQoi-bCfBogr9txLkdp5q-288NrD6xXvDBJcIVrMk4xzk4kQhNXxOJOXZUu-QO1wkacUj',
        },
        {
          type: 'image',
          src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcBqWdOF8zLmkXCd1L8lCoFKfUCRowGL3GuHZ5tmLmf052cpUJozvhD-6rms_qfZIFhWedmGJa805VXRY-56vOKvqamiGMLbqtQAin7h_buTvwbZ-ajP5mqwySu354tkep-HrZn8A2Jni5vH6YCaNO0phpGThuinct4NIstvYXiKDcfr4HiTJ4T4-PF51K8OtMjWu1e25-Rgw0KQsSSUSYHgZjnzVkfdgZ3uq69jlf4ZJNGBH4KKqfE-Xw-rM2PayHyH9sVNQMMIHL',
        },
        {
          type: 'image',
          src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApJ_yF-hCA4e8pxaSg0Mhy8UCrbm7-PPiHLb-5c3XkmoIzpb-GhAD7VUODngcx3i4DciLM_F5Aii1BAN6w61cV9i1M8wPrOD_SePK1_lg7R9eKJYGyvKrfXRxz9ogpAMoZgHGmfQOUTuhd12JAV7jDBbFs8jqfjWCXbMABElVJcjMghzjZsdZ2wHFaica2eqzaZcKIdAd6phKE0OBUWnfxwRk1AoKyvvXZGWoRIEHk-yOfCI2s59n3CXWzDd_OVeXrT_vqfz62fkbQ',
        },
      ],
      main:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA_vgRU_vQSPEOfR4VPi3BbLU2cBtweHu14FAw1tdWlRNDaiutmtpMCsk6hLjASXHlEk_S1uMfxalA1obNP_1qLtLRA4_U3G6UkQaO4kR9UQvbY_EtBxyIzNxcW9VDA6cFEYfQEH7ruIH7HzfvQomQ1lrrnN-xk2FnykQhZNgW4C4rnzb99M4rnFl4DqlF-zzDN6LGGrTYrI9tEG794S8j3lieQWICqy9hxj2tkPc8at8h22GnJHRunB9AA5Y1V3gsPiOKZtCMXvxMi',
    },
    features: [
      { icon: 'pages', label: '40 Fun Pages' },
      { icon: 'ages', label: 'Ages 4-8' },
      { icon: 'art', label: 'Colorful Art' },
      { icon: 'learn', label: 'Learn & Play' },
    ],
    languages: ['en', 'ru'],
  },

  {
    slug: 'girl-and-the-forest-friends',
    title: 'Girl and the Forest Friends',
    gender: 'Girl',
    ageRange: ['2-4', '4-6'],
    price: 34.99,
    oldPrice: 44.0,
    rating: 4.7,
    ratingCount: 1803,
    cover:
      "https://storage.wonderwraps.com/dba4123e-03e0-408c-ad1f-7e5ff8f9fd2a/iUw0VHezB6zQ2HLElGCD2MUHZFslw3-metaamFzcGVyIG93bC5wbmc=-.png",
    description:
      'A gentle tale about kindness, nature, and friendship—with charming woodland creatures.',
    gallery: { thumbs: [], main: '' },
    features: [
      { icon: 'pages', label: '32 Pages' },
      { icon: 'ages', label: 'Ages 2-6' },
      { icon: 'art', label: 'Soft Watercolors' },
      { icon: 'learn', label: 'Emotional Learning' },
    ],
    languages: ['en', 'ru'],
  },

  {
    slug: 'adventures-under-the-sea',
    title: 'Adventures Under the Sea',
    gender: 'Boy',
    ageRange: ['0-2', '2-4'],
    price: 24.99,
    oldPrice: null,
    rating: 4.6,
    ratingCount: 956,
    cover:
      "https://storage.wonderwraps.com/ff0e60b5-1227-4081-b690-f37151d1cbc0/responsive-images/wftNJAHQBHdYyB3iOXnrG0oz6OTeDq-metaY292ZXIucG5n-___media_library_original_550_550.png",
    description: 'Splashy colors and friendly sea creatures for the smallest readers.',
    gallery: { thumbs: [], main: '' },
    features: [
      { icon: 'pages', label: '24 Pages' },
      { icon: 'ages', label: 'Ages 0-4' },
      { icon: 'art', label: 'Bold Colors' },
      { icon: 'learn', label: 'First Words' },
    ],
    languages: ['en', 'ru'],
  },

  {
    slug: 'space-cadet-dreams',
    title: 'Space Cadet Dreams',
    gender: 'Girl',
    ageRange: ['6-8', '8+'],
    price: 29.99,
    oldPrice: 36.0,
    rating: 4.9,
    ratingCount: 1102,
    cover:
      "https://storage.wonderwraps.com/dba4123e-03e0-408c-ad1f-7e5ff8f9fd2a/iUw0VHezB6zQ2HLElGCD2MUHZFslw3-metaamFzcGVyIG93bC5wbmc=-.png",
    description: 'Blast off into STEM with a brave cadet exploring the galaxy.',
    gallery: { thumbs: [], main: '' },
    features: [
      { icon: 'pages', label: '48 Pages' },
      { icon: 'ages', label: 'Ages 6-10' },
      { icon: 'art', label: 'Vibrant Sci-Fi' },
      { icon: 'learn', label: 'STEM Themes' },
    ],
    languages: ['en'],
  },
];

export const getAllBooks = () => allBooks;
export const getBookBySlug = (slug) => allBooks.find((b) => b.slug === slug);

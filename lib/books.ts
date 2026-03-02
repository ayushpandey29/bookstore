export interface Book {
  id: string
  title: string
  author: string
  price: number
  originalPrice?: number
  cover: string
  category: string
  rating: number
  reviewCount: number
  description: string
  longDescription: string
  pages: number
  publisher: string
  publishDate: string
  isbn: string
  language: string
  featured?: boolean
  bestSeller?: boolean
  newRelease?: boolean
}

export const categories = [
  "Self-Help",
  "Productivity",
  "Finance",
  "Philosophy",
  "Business",
  "History",
  "Fiction",
  "Success",
] as const

export type Category = (typeof categories)[number]

export const books: Book[] = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    price: 299,
    cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop",
    category: "Self-Help",
    rating: 4.8,
    reviewCount: 12453,
    description: "Tiny changes, remarkable results.",
    longDescription:
      "A proven framework for building good habits and breaking bad ones. James Clear reveals how small 1% improvements compound into extraordinary results over time. Covers the four laws of behavior change, habit stacking, and environment design.",
    pages: 320,
    publisher: "Penguin Random House",
    publishDate: "2018-10-16",
    isbn: "978-0735211292",
    language: "English",
    featured: true,
    bestSeller: true,
  },
  {
    id: "2",
    title: "Deep Work",
    author: "Cal Newport",
    price: 349,
    cover: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=600&fit=crop",
    category: "Productivity",
    rating: 4.6,
    reviewCount: 7891,
    description: "Rules for focused success in a distracted world.",
    longDescription:
      "Cal Newport argues that the ability to focus without distraction is the superpower of the 21st century. Learn how to cultivate deep focus, eliminate shallow work, and produce at your peak level.",
    pages: 304,
    publisher: "Grand Central Publishing",
    publishDate: "2016-01-05",
    isbn: "978-1455586691",
    language: "English",
    featured: true,
  },
  {
    id: "3",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    price: 399,
    cover: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop",
    category: "Finance",
    rating: 4.7,
    reviewCount: 9876,
    description: "Timeless lessons on wealth, greed, and happiness.",
    longDescription:
      "Through 19 short stories, Morgan Housel explores the strange ways people think about money and teaches you how to make better sense of one of life's most important topics.",
    pages: 256,
    publisher: "Harriman House",
    publishDate: "2020-09-08",
    isbn: "978-0857197689",
    language: "English",
    featured: true,
    bestSeller: true,
  },
  {
    id: "4",
    title: "Ikigai",
    author: "Hector Garcia",
    price: 249,
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    category: "Philosophy",
    rating: 4.4,
    reviewCount: 6543,
    description: "The Japanese secret to a long and happy life.",
    longDescription:
      "Ikigai is the Japanese concept of finding your reason for being. This book explores the lifestyle habits of the world's longest-living people in Okinawa and reveals the secrets to a purposeful, joyful life.",
    pages: 208,
    publisher: "Hutchinson",
    publishDate: "2017-08-29",
    isbn: "978-0143130727",
    language: "English",
    bestSeller: true,
    newRelease: false,
  },
  {
    id: "5",
    title: "Zero to One",
    author: "Peter Thiel",
    price: 449,
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    category: "Business",
    rating: 4.5,
    reviewCount: 8234,
    description: "Notes on startups, or how to build the future.",
    longDescription:
      "Peter Thiel, co-founder of PayPal, shares his contrarian thinking on innovation. Every great business is built around a secret that others don't see. This book teaches you how to think for yourself and create something truly new.",
    pages: 224,
    publisher: "Currency",
    publishDate: "2014-09-16",
    isbn: "978-0804139298",
    language: "English",
    featured: true,
    bestSeller: true,
  },
  {
    id: "6",
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    price: 299,
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    category: "Self-Help",
    rating: 4.3,
    reviewCount: 11234,
    description: "A counterintuitive approach to living a good life.",
    longDescription:
      "Mark Manson argues that improving our lives hinges not on positivity but on identifying and prioritizing the things that truly matter. A raw, entertaining, and deeply human guide to living well.",
    pages: 224,
    publisher: "Harper",
    publishDate: "2016-09-13",
    isbn: "978-0062457714",
    language: "English",
    bestSeller: true,
    newRelease: true,
  },
  {
    id: "7",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    price: 499,
    cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop",
    category: "History",
    rating: 4.7,
    reviewCount: 15234,
    description: "A brief history of humankind.",
    longDescription:
      "From the Stone Age to Silicon Age, Harari explores how Homo sapiens came to dominate the Earth. Covers cognitive revolution, agricultural revolution, scientific revolution, and the future of our species.",
    pages: 498,
    publisher: "Harper Perennial",
    publishDate: "2015-02-10",
    isbn: "978-0062316110",
    language: "English",
    featured: true,
    bestSeller: true,
  },
  {
    id: "8",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    price: 199,
    cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop",
    category: "Finance",
    rating: 4.5,
    reviewCount: 19876,
    description: "What the rich teach their kids about money.",
    longDescription:
      "Robert Kiyosaki shares the story of his two dads -- his real father and the father of his best friend -- and the ways in which both men shaped his thoughts about money, investing, and financial independence.",
    pages: 336,
    publisher: "Plata Publishing",
    publishDate: "1997-04-01",
    isbn: "978-1612680194",
    language: "English",
    bestSeller: true,
    newRelease: true,
  },
  {
    id: "9",
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    price: 149,
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    category: "Success",
    rating: 4.6,
    reviewCount: 14321,
    description: "The landmark bestseller on achieving personal goals.",
    longDescription:
      "After studying over 500 of America's most successful individuals, Napoleon Hill identified 13 principles of success including desire, faith, specialized knowledge, and persistence that anyone can apply.",
    pages: 320,
    publisher: "TarcherPerigee",
    publishDate: "1937-03-26",
    isbn: "978-1585424337",
    language: "English",
    featured: true,
    newRelease: true,
  },
  {
    id: "10",
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 99,
    cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
    category: "Fiction",
    rating: 4.6,
    reviewCount: 22345,
    description: "A magical fable about following your dreams.",
    longDescription:
      "Santiago, an Andalusian shepherd boy, travels from Spain to Egypt in search of treasure. Along the way he discovers that the real treasure lies within himself. A timeless story about destiny, dreams, and the language of the universe.",
    pages: 208,
    publisher: "HarperOne",
    publishDate: "1988-01-01",
    isbn: "978-0062315007",
    language: "English",
    bestSeller: true,
  },
]

export function getBookById(id: string): Book | undefined {
  return books.find((book) => book.id === id)
}

export function getBooksByCategory(category: string): Book[] {
  return books.filter((book) => book.category === category)
}

export function getFeaturedBooks(): Book[] {
  return books.filter((book) => book.featured)
}

export function getBestSellers(): Book[] {
  return books.filter((book) => book.bestSeller)
}

export function getNewReleases(): Book[] {
  return books.filter((book) => book.newRelease)
}

export function searchBooks(query: string): Book[] {
  const lower = query.toLowerCase()
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(lower) ||
      book.author.toLowerCase().includes(lower) ||
      book.category.toLowerCase().includes(lower) ||
      book.description.toLowerCase().includes(lower)
  )
}

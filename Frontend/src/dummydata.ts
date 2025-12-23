import fashion from './assets/images/Fashion_Unimart.jpg'
import food from './assets/images/Food_Unimart.jpg'
import electronics from './assets/images/Electronics_Unimart.jpg'
import education from './assets/images/Education_Unimart.jpg'

export interface IVendorProfile {
  id: string
  businessName: string
  fullName: string
  email: string
  whatsappNumber: string
  category: string
  subcategory: string
  description: string
  faculty: string
  location: string
  offerings: string[]
  profilePictureUrl: string
  backdropPictureUrl: string
  isVerified: boolean
  rating: number
  reviewCount: number
  responseTime: string
  reviews: Array<{
    id: string
    customerName: string
    customerFaculty: string
    rating: number
    date: string
    comment: string
  }>
}

export const MOCK_VENDORS: IVendorProfile[] = [
  {
    // First vendor must match the design: "Sarah's Kitchen"
    id: 'sarah-kitchen',
    businessName: "Sarah's Kitchen",
    fullName: 'Sarah A. Adeyemi',
    email: 'sarah.kitchen@unimart.edu',
    whatsappNumber: '2348012345678',
    category: 'Food',
    subcategory: 'Nigerian Cuisine',
    description:
      'Sarah prepares homestyle Nigerian dishes with fresh ingredients. Popular items include jollof rice, amala and ewedu, and small chops for events. Meals are prepared daily and available for pick-up or delivery on campus.',
    faculty: 'Faculty of Arts',
    location: 'Main Campus Canteen',
    offerings: ['Jollof Rice', 'Amala & Ewedu', 'Small Chops', 'Plantain'],
    profilePictureUrl: food,
    backdropPictureUrl: food,
    isVerified: true,
    rating: 4.8,
    reviewCount: 152,
    responseTime: '< 30 mins',
    reviews: [
      {
        id: 'r1',
        customerName: 'Tomi O.',
        customerFaculty: 'Engineering',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Delicious jollof and very quick delivery. Highly recommend!'
      },
      {
        id: 'r2',
        customerName: 'Nkechi A.',
        customerFaculty: 'Management',
        rating: 4,
        date: '1 month ago',
        comment: 'Great flavors — would order again.'
      }
    ]
  },
//   create 10 more vendor profiles with different details

  {
    id: 'basil-bakes',
    businessName: 'Basil Bakes',
    fullName: 'Michael Basil',
    email: 'michael@basilbakes.edu',
    whatsappNumber: '2348023456789',
    category: 'Food',
    subcategory: 'Bakery',
    description:
      'Freshly baked cakes, pastries, and bread prepared daily. Special orders for birthdays and events. Vegan options available on request.',
    faculty: 'Management',
    location: 'Student Village',
    offerings: ['Custom Cakes', 'Cupcakes', 'Bread', 'Pastries'],
    profilePictureUrl: food,
    backdropPictureUrl: food,
    isVerified: false,
    rating: 4.3,
    reviewCount: 67,
    responseTime: '< 1 hour',
    reviews: [
      {
        id: 'r3',
        customerName: 'Kemi L.',
        customerFaculty: 'Arts',
        rating: 5,
        date: '3 days ago',
        comment: 'Beautiful cake and on time for the party.'
      }
    ]
  }
  ,
  {
    id: 'campus-threads',
    businessName: 'Campus Threads',
    fullName: 'Aisha Bello',
    email: 'aisha@campusthreads.edu',
    whatsappNumber: '2347012345678',
    category: 'Fashion',
    subcategory: 'Apparel',
    description: 'Custom tees, hoodies, and varsity jackets with campus prints. Group orders and event merchandise available.',
    faculty: 'Arts',
    location: 'Market Row',
    offerings: ['Custom Tees', 'Hoodies', 'Jackets', 'Merch'],
    profilePictureUrl: fashion,
    backdropPictureUrl: fashion,
    isVerified: false,
    rating: 4.2,
    reviewCount: 48,
    responseTime: '< 2 hours',
    reviews: [
      { id: 'r4', customerName: 'Daniel O.', customerFaculty: 'Engineering', rating: 4, date: '1 week ago', comment: 'Great quality prints.' }
    ]
  },
  {
    id: 'gadget-fixers',
    businessName: 'Gadget Fixers',
    fullName: 'Chinedu Okeke',
    email: 'chinedu@gadgetfixers.edu',
    whatsappNumber: '2348035550001',
    category: 'Services',
    subcategory: 'Repairs',
    description: 'Reliable phone and laptop repairs with genuine parts and warranty on repairs.',
    faculty: 'Sciences',
    location: 'Tech Hub',
    offerings: ['Screen Repair', 'Battery Replacement', 'Data Recovery'],
    profilePictureUrl: electronics,
    backdropPictureUrl: electronics,
    isVerified: true,
    rating: 4.8,
    reviewCount: 200,
    responseTime: '< 30 mins',
    reviews: [
      { id: 'r5', customerName: 'Ama R.', customerFaculty: 'Sciences', rating: 5, date: '3 days ago', comment: 'Quick and affordable repairs.' }
    ]
  },
  {
    id: 'sweet-bakes',
    businessName: 'Sweet Bakes',
    fullName: 'Lola Martins',
    email: 'lola@sweetbakes.edu',
    whatsappNumber: '2348029991112',
    category: 'Food',
    subcategory: 'Bakery',
    description: 'Made-to-order cakes and confectioneries. Fresh ingredients and bespoke designs.',
    faculty: 'Management',
    location: 'Bakery Lane',
    offerings: ['Cakes', 'Pastries', 'Cookies'],
    profilePictureUrl: food,
    backdropPictureUrl: food,
    isVerified: false,
    rating: 3.9,
    reviewCount: 18,
    responseTime: '< 4 hours',
    reviews: [
      { id: 'r6', customerName: 'Sam K.', customerFaculty: 'Law', rating: 4, date: '2 months ago', comment: 'Tasty pastries.' }
    ]
  },
  {
    id: 'printlab',
    businessName: 'PrintLab',
    fullName: 'Ngozi Ihe',
    email: 'ngozi@printlab.edu',
    whatsappNumber: '2348091112233',
    category: 'Services',
    subcategory: 'Printing',
    description: 'High-quality prints, flyers, banners and booklets for campus events and societies.',
    faculty: 'Law',
    location: 'Print Block',
    offerings: ['Flyers', 'Banners', 'Booklets', 'Stickers'],
    profilePictureUrl: education,
    backdropPictureUrl: education,
    isVerified: false,
    rating: 4.1,
    reviewCount: 34,
    responseTime: '< 1 day',
    reviews: [
      { id: 'r7', customerName: 'Ife O.', customerFaculty: 'Arts', rating: 4, date: '4 days ago', comment: 'Great prints for our event.' }
    ]
  },
  {
    id: 'spice-route',
    businessName: 'Spice Route',
    fullName: 'Olumide A.',
    email: 'olumide@spiceroute.edu',
    whatsappNumber: '2348064443322',
    category: 'Food',
    subcategory: 'Street Food',
    description: 'Street-style wraps and spicy local bites, perfect for a quick lunch on campus.',
    faculty: 'Science',
    location: 'Food Court',
    offerings: ['Wraps', 'Spicy Snacks', 'Drinks'],
    profilePictureUrl: food,
    backdropPictureUrl: food,
    isVerified: true,
    rating: 4.5,
    reviewCount: 78,
    responseTime: '< 45 mins',
    reviews: [
      { id: 'r8', customerName: 'Yusuf B.', customerFaculty: 'Engineering', rating: 5, date: '5 days ago', comment: 'Best suya on campus.' }
    ]
  },
  {
    id: 'designhub',
    businessName: 'DesignHub',
    fullName: 'Ruth Nnamdi',
    email: 'ruth@designhub.edu',
    whatsappNumber: '2348087774455',
    category: 'Services',
    subcategory: 'Design',
    description: 'Graphic design and branding services for clubs, events, and student startups.',
    faculty: 'Engineering',
    location: 'Studio 3',
    offerings: ['Branding', 'Posters', 'Social Media Design'],
    profilePictureUrl: electronics,
    backdropPictureUrl: electronics,
    isVerified: false,
    rating: 4.0,
    reviewCount: 12,
    responseTime: '< 24 hours',
    reviews: [
      { id: 'r9', customerName: 'Ayo M.', customerFaculty: 'Management', rating: 4, date: '2 weeks ago', comment: 'Clean designs and fast turnarounds.' }
    ]
  },
  {
    id: 'vintage-vibes',
    businessName: 'Vintage Vibes',
    fullName: 'Bola Adeniyi',
    email: 'bola@vintagevibes.edu',
    whatsappNumber: '2348052227788',
    category: 'Fashion',
    subcategory: 'Vintage',
    description: 'Curated pre-loved clothing and accessories with unique vintage finds.',
    faculty: 'Arts',
    location: 'Flea Market',
    offerings: ['Vintage Jackets', 'Accessories', 'Pre-loved Dresses'],
    profilePictureUrl: fashion,
    backdropPictureUrl: fashion,
    isVerified: true,
    rating: 4.7,
    reviewCount: 64,
    responseTime: '< 3 days',
    reviews: [
      { id: 'r10', customerName: 'Sade P.', customerFaculty: 'Arts', rating: 5, date: '6 days ago', comment: 'Lovely vintage pieces at good prices.' }
    ]
  },
  {
    id: 'quickfix-tutors',
    businessName: 'QuickFix Tutors',
    fullName: 'Emeka U.',
    email: 'emeka@quickfix.edu',
    whatsappNumber: '2348143332211',
    category: 'Services',
    subcategory: 'Tutoring',
    description: 'Private tutoring and exam prep for undergraduate courses with flexible scheduling.',
    faculty: 'Education',
    location: 'Library Annex',
    offerings: ['One-on-one Tutoring', 'Group Sessions', 'Exam Prep'],
    profilePictureUrl: education,
    backdropPictureUrl: education,
    isVerified: false,
    rating: 3.8,
    reviewCount: 9,
    responseTime: '< 12 hours',
    reviews: [
      { id: 'r11', customerName: 'Grace T.', customerFaculty: 'Education', rating: 4, date: '1 month ago', comment: 'Helped me pass my course.' }
    ]
  },
  {
    id: 'campus-coffee',
    businessName: 'Campus Coffee',
    fullName: 'Peter I.',
    email: 'peter@campuscoffee.edu',
    whatsappNumber: '2348120001110',
    category: 'Food',
    subcategory: 'Cafe',
    description: 'Freshly brewed coffee, sandwiches and study-friendly seating for students.',
    faculty: 'Management',
    location: 'Student Centre',
    offerings: ['Coffee', 'Sandwiches', 'Pastries'],
    profilePictureUrl: food,
    backdropPictureUrl: food,
    isVerified: true,
    rating: 4.3,
    reviewCount: 90,
    responseTime: '< 20 mins',
    reviews: [
      { id: 'r12', customerName: 'Chioma N.', customerFaculty: 'Management', rating: 5, date: '2 days ago', comment: 'Great place to study and grab coffee.' }
    ]
  }
]

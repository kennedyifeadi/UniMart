import fashion from '../assets/images/Fashion_Unimart.jpg'
import food from '../assets/images/Food_Unimart.jpg'
import electronics from '../assets/images/Electronics_Unimart.jpg'
import education from '../assets/images/Education_Unimart.jpg'
import { TrustCard } from '../components/home/TrustCard'
import type { TrustCardProps } from '../components/home/TrustCard'
import { RiUserFill } from "react-icons/ri";
import { HiBuildingStorefront } from "react-icons/hi2";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { FeaturedVendorsCard } from '../components/home/FeaturedVendorsCard'
import type { FeaturedVendorsCardProps } from '../components/home/FeaturedVendorsCard'
import { TestimonialsCard } from '../components/home/TestimonialsCard'
import type { TestimonialsCardProps } from '../components/home/TestimonialsCard'
import { Carousel } from '../components/carousel/Carousel'
import { Landing } from '../components/home/Landing'


const Home = () => {
  const testimonialsCardDetails: TestimonialsCardProps[] = [
    {
      name: 'Alice Johnson',
      feedback: '"I love how easy it is to connect with other students and local businesses. The interface is beautiful and user-friendly. Unimart truly understands what students need!"',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      rating: 5,
      faculty: 'Faculty of Technology',
    },
    {
      name: 'Michael Smith',
      feedback: '"As a student entrepreneur, Unimart gave me the perfect platform to reach other students. My tutoring business has grown so much thanks to this amazing marketplace!"',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      rating: 4,
      faculty: 'Faculty of Science',
    },
    {
      name: 'Emily Davis',
      feedback: '"Unimart has completely changed how I shop on campus. I found the best phone repair service and even discovered amazing local food vendors. The community aspect is incredible!"',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      rating: 5,
      faculty: 'Faculty of Arts',
    },
    {
      name: 'James Wilson',
      feedback: '"The variety of services available is amazing. From food delivery to study materials, everything I need as a student is right here. Plus, supporting fellow students feels great!"',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      rating: 5,
      faculty: 'Faculty of Business',
    }
  ]
  const featuredVendors: FeaturedVendorsCardProps[] = [
    {
      name: "Sarah's Snack Hub",
      description: 'Healthy snacks and fresh meals for busy students',
      link: 'vendor1.com',
      category: 'food',
      verified: true,
      image: food
    },
    {
      name: 'Tech Repair Pro',
      description: 'Fast and reliable phone & laptop repairs',
      link: 'vendor2.com',
      category: 'electronics',
      verified: false,
      image: electronics
    },
    {
      name: 'Campus Threads',
      description: 'Trendy fashion for the modern student',
      link: 'vendor3.com',
      category: 'fashion',
      verified: true,
      image: fashion
    },
    {
      name: 'Study Buddy Tutoring',
      description: 'Personalized tutoring for all subjects',
      link: 'vendor4.com',
      category: 'education',
      verified: false,
      image: education
    }
  ]

  const trustCardDetails: TrustCardProps[] = [
    {
      name: 'UI Student',
      number: "5,000+",
      icon: <RiUserFill />
    },
    {
      name: 'Student Vendors',
      number: "150+",
      icon: <HiBuildingStorefront />
    },
    {
      name: 'Faculties Served',
      number: "12",
      icon: <HiMiniBuildingOffice2 />

    }
  ]
  return (
    <div className='w-full h-max flex flex-col relative'>
      <Landing />
      {/* Trusted Community Section */}
      <div className='p-4 md:py-16 py-10 flex flex-col items-center bg-[#f9fafb]'>
        <h1 className='text-3xl md:text-5xl text-center font-bold md:mb-3'>Trusted by the UI Community</h1>
        <span className='text-center tracking-wide font-normal md:text-xl text-sm text-gray-700'>Growing stronger every day with amazing students and businesses</span>
        <div className='flex flex-wrap justify-around gap-4 md:gap-0 w-[90%] mt-10'>
          {trustCardDetails.map((card, index) => (
            <TrustCard key={index} {...card} />
          ))}
        </div>
      </div>
      {/* Featured Vendors Section */}
      <div className='p-4 pt-10 md:pt-16 flex flex-col items-center bg-white'>
        <h1 className='text-3xl md:text-5xl text-center font-bold md:mb-3'>Featured Vendors</h1>
        <span className='text-center tracking-wide font-normal md:text-xl text-sm text-gray-700'>Discover amazing businesses run by your fellow students</span>
        {/* Mobile Carousel View */}
        <div className='md:hidden w-[90%] mt-16'>
          <Carousel autoPlayInterval={0}>
            {featuredVendors.map((vendor, index) => (
              <FeaturedVendorsCard key={index} {...vendor} />
            ))}
          </Carousel>
        </div>
        {/* Desktop Grid View */}
        <div className='hidden md:flex flex-wrap justify-around w-[90%] mt-16'>
          {featuredVendors.map((vendor, index) => (
            <FeaturedVendorsCard key={index} {...vendor} />
          ))}
        </div>
      </div>
      <div className='p-4 py-10 md:py-16 flex flex-col items-center bg-[#f9fafb]'>
        <h1 className='text-3xl md:text-5xl text-center font-bold md:mb-3'>What Students Say</h1>
        <span className='text-center tracking-wide font-normal md:text-xl  text-sm text-gray-700'>Real experiences from our amazing UI community</span>
        <div className='flex justify-center items-center w-[90%] mt-20'>
          <Carousel autoPlayInterval={3000}>
            {testimonialsCardDetails.map((testimonial, index) => (
              <TestimonialsCard key={index} {...testimonial} />
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  )
}


export default Home

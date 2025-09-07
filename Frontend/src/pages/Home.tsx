import fashion from '../assets/images/Fashion_Unimart.jpg'
import food from '../assets/images/Food_Unimart.jpg'
import electronics from '../assets/images/Electronics_Unimart.jpg'
import education from '../assets/images/Education_Unimart.jpg'
import withMainLayout from '../layouts/MainLayout'

const Home = () => {
  const testimonialsCardDetails = [
    {
      name: 'Alice Johnson',
      feedback: '"I love how easy it is to connect with other students and local businesses. The interface is beautiful and user-friendly. Unimart truly understands what students need!"',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      rateing: 5,
      faculty: 'Technology',
    },
    {
      name: 'Michael Smith',
      feedback: '"As a student entrepreneur, Unimart gave me the perfect platform to reach other students. My tutoring business has grown so much thanks to this amazing marketplace!"',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      rating: 4,
      faculty: 'Science',
    },
    {
      name: 'Emily Davis',
      feedback: '"Unimart has completely changed how I shop on campus. I found the best phone repair service and even discovered amazing local food vendors. The community aspect is incredible!"',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      rating: 5,
      faculty: 'Arts',
    },
    {
      name: 'James Wilson',
      feedback: '"The variety of services available is amazing. From food delivery to study materials, everything I need as a student is right here. Plus, supporting fellow students feels great!"',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      rating: 5,
      faculty: 'Business',
    }
  ]
  const featureedVendors = [
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
      verified: false,
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
  const trustCardDetails = [
    {
      name: 'UI Student',
      number: "5000+",
      icon: 'student'
    },
    {
      name: 'Student Vendors',
      number: "150+",
      icon: 'product'
    },
    {
      name: 'Faculties Served',
      number: "12",
      icon: 'happy-user'
    }
  ]
  return (
    <div>Home</div>
  )
}


export default withMainLayout(Home)


export const DynamicBackground = ({image}: {image: string}) => {
  return (
    <div className='w-full h-full absolute top-0 -z-10'>
        <div className="w-full h-full absolute top-0 bg-black/55 " ></div>
      <img src={image} alt="Dynamic Background" className='w-full h-full object-cover' />
    </div>
  )
}

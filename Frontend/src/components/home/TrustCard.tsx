export interface TrustCardProps {
  name: string;
  number: string;
  icon: React.ReactElement;
}

export const TrustCard = ({ name, number, icon }: TrustCardProps) => {
  return (
    <div className=" w-[420px] h-[220px] shadow-md bg-white p-2 flex flex-col items-center py-6 gap-4 rounded-lg">
      <div className="w-12 h-12 rounded-full bg-[#dbeafe] text-[#2563eb] flex items-center justify-center text-2xl">
        {icon}
      </div>
      {/* <div>{icon === 'students' && <StudentIcon />}{icon === 'businesses' && <BusinessIcon />}{icon === 'transactions' && <TransactionIcon />}</div> */}
      <div className="flex flex-col items-center">
        <h2 className="font-bold md:text-4xl text-2xl">{number}</h2>
        <p className="text-sm md:text-xl text-gray-800">{name}</p>
      </div>
      {/* {icon} */}
    </div>
  )
}

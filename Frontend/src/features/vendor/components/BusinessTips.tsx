
export default function BusinessTips() {
  const tips = [
    { id: 'b1', title: 'Boost Your Visibility', text: 'Add high-quality photos and update categories.', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'b2', title: 'Respond Quickly', text: 'Reply to messages within 24 hours to improve ranking.', bg: 'bg-green-50', border: 'border-green-200' },
    { id: 'b3', title: 'Update Business Hours', text: 'Keep your hours current for accurate expectations.', bg: 'bg-purple-50', border: 'border-purple-200' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h4 className="font-semibold mb-3">Business Tips</h4>
      <div className="space-y-3">
        {tips.map((t) => (
          <div key={t.id} className={`${t.bg} border ${t.border} p-3 rounded`}> 
            <div className="font-medium">{t.title}</div>
            <div className="text-sm text-gray-600">{t.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

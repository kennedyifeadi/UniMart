export default function ConfirmationModal({ title, message, onConfirm, onClose }: { title: string; message: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex gap-2 justify-end">
          <button className="px-4 py-2 rounded bg-gray-100" onClick={onClose}>Later</button>
          <button className="px-4 py-2 rounded bg-[#2563eb] text-white" onClick={onConfirm}>Go to Dashboard</button>
        </div>
      </div>
    </div>
  )
}

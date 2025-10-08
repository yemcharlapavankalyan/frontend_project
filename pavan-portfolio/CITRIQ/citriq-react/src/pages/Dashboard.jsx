import ChatBoard from '../components/ChatBoard.jsx'

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Your Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">Pending Reviews: 2</div>
        <div className="rounded-lg border bg-white p-4">Completed Reviews: 4</div>
        <div className="rounded-lg border bg-white p-4">Average Rating: 4.3</div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Team Collaboration</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border bg-white p-4">Recent Activity: Uploaded project link</div>
          <div>
            <ChatBoard />
          </div>
        </div>
      </div>
    </div>
  )
}



import { createFileRoute } from '@tanstack/react-router'
import LandRecordsPage from '../components/LandRecordsPage'
import { getLandRecords } from '../server/land-records.functions'

export const Route = createFileRoute('/')({
  loader: () => getLandRecords(),
  component: Home,
})

function Home() {
  const records = Route.useLoaderData()
  return <LandRecordsPage initialRecords={records as never} />
}

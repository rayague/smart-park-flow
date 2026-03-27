import { redirect } from 'next/navigation'

export default function AdminManagersPage() {
    redirect('/dashboard/admin/users?role=MANAGER')
}

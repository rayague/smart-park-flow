"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    MoreHorizontal,
    Mail,
    Shield,
    Ban,
    CheckCircle2,
    Building2,
    User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"
import { supabase } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"

interface UserData {
    id: string
    name: string
    email: string
    role: "user" | "manager" | "admin"
    status: "active" | "suspended" | "pending"
    joinDate: string
    lastActive: string
}

export function UsersTable() {
    const { t } = useTranslation()
    const [users, setUsers] = React.useState<UserData[]>([])
    const [loading, setLoading] = React.useState(true)
    const [selectedUsers, setSelectedUsers] = React.useState<string[]>([])

    React.useEffect(() => {
        async function fetchUsers() {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50)

            if (error) {
                console.error('Failed to fetch users:', error)
                setUsers([])
            } else {
                const mapped: UserData[] = (data || []).map((p: any) => ({
                    id: p.id,
                    name: p.full_name || p.email?.split('@')[0] || 'User',
                    email: p.email || '-',
                    role: (p.role || 'user').toLowerCase(),
                    status: p.status?.toLowerCase() || 'active',
                    joinDate: p.created_at ? new Date(p.created_at).toLocaleDateString() : '-',
                    lastActive: p.last_sign_in_at 
                        ? formatDistanceToNow(new Date(p.last_sign_in_at), { addSuffix: true })
                        : 'Never',
                }))
                setUsers(mapped)
            }
            setLoading(false)
        }

        fetchUsers()
    }, [])

    const toggleUser = (id: string) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
        )
    }

    const toggleAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([])
        } else {
            setSelectedUsers(users.map((u) => u.id))
        }
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "admin":
                return <Shield className="h-3 w-3" />
            case "manager":
                return <Building2 className="h-3 w-3" />
            default:
                return <User className="h-3 w-3" />
        }
    }

    const getRoleStyle = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-red-500/10 text-red-500"
            case "manager":
                return "bg-purple-500/10 text-purple-500"
            default:
                return "bg-blue-500/10 text-blue-500"
        }
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-500/10 text-green-500"
            case "suspended":
                return "bg-red-500/10 text-red-500"
            default:
                return "bg-yellow-500/10 text-yellow-500"
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl glass p-6"
        >
            <div className="mb-6 flex items-center justify-between">
                <h3 className="font-serif text-xl font-semibold">
                    {t.adminDashboard.sections.recentSignups}
                </h3>
                <div className="flex gap-2">
                    {selectedUsers.length > 0 && (
                        <>
                            <Button variant="outline" size="sm" className="gap-1">
                                <Mail className="h-4 w-4" />
                                Email ({selectedUsers.length})
                            </Button>
                            <Button variant="destructive" size="sm" className="gap-1">
                                <Ban className="h-4 w-4" />
                                Suspend
                            </Button>
                        </>
                    )}
                    <Button size="sm" className="gap-1 bg-gradient-to-r from-red-500 to-orange-500">
                        {t.adminDashboard.actions.addUser}
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border/50">
                            <th className="pb-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.length === users.length && users.length > 0}
                                    onChange={toggleAll}
                                    className="rounded border-border"
                                />
                            </th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">User</th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Joined</th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Last Active</th>
                            <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {users.map((user, index) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.05 }}
                                className="group"
                            >
                                <td className="py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => toggleUser(user.id)}
                                        className="rounded border-border"
                                    />
                                </td>
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                                            <span className="text-sm font-semibold">
                                                {user.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleStyle(user.role)}`}>
                                        {getRoleIcon(user.role)}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-4">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(user.status)}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${user.status === "active" ? "bg-green-500" :
                                                user.status === "suspended" ? "bg-red-500" : "bg-yellow-500"
                                            }`} />
                                        {user.status}
                                    </span>
                                </td>
                                <td className="py-4 text-sm text-muted-foreground">
                                    {user.joinDate}
                                </td>
                                <td className="py-4 text-sm text-muted-foreground">
                                    {user.lastActive}
                                </td>
                                <td className="py-4 text-right">
                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    )
}

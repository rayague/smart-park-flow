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
    User,
    UserPlus,
    Trash2,
    Edit
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/lib/i18n"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
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

interface UsersTableProps {
    roleFilter?: "all" | "USER" | "MANAGER" | "ADMIN"
    searchQuery?: string
}

export function UsersTable({ roleFilter = "all", searchQuery = "" }: UsersTableProps) {
    const { t } = useTranslation()
    const [users, setUsers] = React.useState<UserData[]>([])
    const [loading, setLoading] = React.useState(true)
    const [selectedUsers, setSelectedUsers] = React.useState<string[]>([])
    const [isAddUserOpen, setIsAddUserOpen] = React.useState(false)
    const [isEditUserOpen, setIsEditUserOpen] = React.useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null)
    const [newUser, setNewUser] = React.useState({
        name: "",
        email: "",
        role: "USER" as "USER" | "MANAGER" | "ADMIN"
    })


    const fetchUsers = React.useCallback(async () => {
        setLoading(true)
        let query = supabase
            .from('profiles')
            .select('*')
        
        if (roleFilter !== "all") {
            query = query.eq('role', roleFilter)
        }

        const { data, error } = await query
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) {
            console.error('Failed to fetch users:', error)
            setUsers([])
        } else {
            const mapped: UserData[] = (data || []).map((p) => ({
                id: p.id,
                name: p.name || "User",
                email: p.email || "-",
                role: (p.role?.toLowerCase() as "user" | "manager" | "admin") || "user",
                status: "active",
                joinDate: p.created_at ? new Date(p.created_at).toLocaleDateString() : "-",
                lastActive: "Today", 
            }))
            setUsers(mapped)
        }
        setLoading(false)
    }, [roleFilter])

    React.useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const { error } = await supabase.from('profiles').insert([
                {
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    created_at: new Date().toISOString(),
                }
            ])

            if (error) throw error

            toast.success("User added successfully")
            setIsAddUserOpen(false)
            setNewUser({ name: "", email: "", role: "USER" })
            fetchUsers()
        } catch (error: any) {
            toast.error(error.message || "Failed to add user")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAction = async (userId: string, action: string) => {
        const user = users.find(u => u.id === userId)
        if (!user) return

        if (action === "delete") {
            setSelectedUserId(userId)
            setIsDeleteConfirmOpen(true)
        } else if (action === "edit") {
            setSelectedUserId(userId)
            setNewUser({
                name: user.name,
                email: user.email,
                role: user.role.toUpperCase() as any
            })
            setIsEditUserOpen(true)
        } else {
            toast.info(`Action ${action} for user ${userId} (Coming soon)`)
        }
    }

    const handleDeleteUser = async () => {
        if (!selectedUserId) return
        setIsSubmitting(true)
        try {
            const { error } = await supabase.from('profiles').delete().eq('id', selectedUserId)
            if (error) throw error
            toast.success("User deleted successfully")
            setIsDeleteConfirmOpen(false)
            fetchUsers()
        } catch (error: any) {
            toast.error(error.message || "Failed to delete user")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedUserId) return
        setIsSubmitting(true)
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
                })
                .eq('id', selectedUserId)

            if (error) throw error

            toast.success("User updated successfully")
            setIsEditUserOpen(false)
            setNewUser({ name: "", email: "", role: "USER" })
            fetchUsers()
        } catch (error: any) {
            toast.error(error.message || "Failed to update user")
        } finally {
            setIsSubmitting(false)
        }
    }


    const filteredUsers = React.useMemo(() => {
        return users.filter(u => 
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [users, searchQuery])

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
                    <Button 
                        size="sm" 
                        className="gap-1 bg-gradient-to-r from-red-500 to-orange-500"
                        onClick={() => setIsAddUserOpen(true)}
                    >
                        <UserPlus className="h-4 w-4" />
                        {t.adminDashboard.actions.addUser}
                    </Button>
                </div>
            </div>

            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t.adminDashboard.actions.addUser}</DialogTitle>
                        <DialogDescription>
                            Create a new user profile manually.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddUser}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t.auth.register.name}</label>
                                <Input 
                                    placeholder="John Doe" 
                                    value={newUser.name}
                                    onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t.auth.login.email}</label>
                                <Input 
                                    type="email" 
                                    placeholder="john@example.com" 
                                    value={newUser.email}
                                    onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <Select 
                                    value={newUser.role} 
                                    onValueChange={(v: any) => setNewUser(prev => ({ ...prev, role: v }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USER">{t.adminDashboard.navigation.users}</SelectItem>
                                        <SelectItem value="MANAGER">{t.adminDashboard.navigation.managers}</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsAddUserOpen(false)}>
                                {t.common.cancel}
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? t.common.loading : t.adminDashboard.actions.addUser}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t.common.edit}</DialogTitle>
                        <DialogDescription>
                            Update the user profile information.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateUser}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t.auth.register.name}</label>
                                <Input 
                                    placeholder="John Doe" 
                                    value={newUser.name}
                                    onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t.auth.login.email}</label>
                                <Input 
                                    type="email" 
                                    placeholder="john@example.com" 
                                    value={newUser.email}
                                    onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <Select 
                                    value={newUser.role} 
                                    onValueChange={(v: any) => setNewUser(prev => ({ ...prev, role: v }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USER">{t.adminDashboard.navigation.users}</SelectItem>
                                        <SelectItem value="MANAGER">{t.adminDashboard.navigation.managers}</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsEditUserOpen(false)}>
                                {t.common.cancel}
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? t.common.loading : t.common.save}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">{t.common.confirm}</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this user? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                            {t.common.cancel}
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteUser} disabled={isSubmitting}>
                            {isSubmitting ? t.common.loading : t.common.delete}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                        {loading ? (
                             <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">{t.common.loading}</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">{"Non trouvé"}</td></tr>
                        ) : (
                            filteredUsers.map((user, index) => (
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
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>{t.adminDashboard.sections.actions || "Actions"}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleAction(user.id, "edit")}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                {t.common.edit}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleAction(user.id, "suspend")}>
                                                <Ban className="mr-2 h-4 w-4" />
                                                {t.adminDashboard.actions.suspend || "Suspend"}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem 
                                                onClick={() => handleAction(user.id, "delete")}
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                {t.common.delete}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </motion.tr>
                        )))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    )
}

import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import SearchUserModal from "./SearchModal";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const safeUsers = Array.isArray(users) ? users : [];

  const filteredUsers = safeUsers
    .filter((u) => u._id !== authUser?._id)
    .filter((u) => (showOnlineOnly ? onlineUsers.includes(u._id) : true));

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <>
      <aside className="flex h-full w-20 flex-col border-r border-base-300 transition-all duration-200 lg:w-72">
        <div className="w-full border-b border-base-300 p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="size-6" />
              <span className="hidden font-medium lg:block">Contacts</span>
            </div>

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="btn btn-ghost btn-circle btn-sm"
              aria-label="Search users"
            >
              <Search className="size-4" />
            </button>
          </div>

          <div className="mt-3 hidden items-center gap-2 lg:flex">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm"
              />
              <span className="text-sm">Show online only</span>
            </label>
            <span className="text-xs text-zinc-500">({Math.max(onlineUsers.length - 1, 0)} online)</span>
          </div>
        </div>

        <div className="w-full overflow-y-auto py-3">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                flex w-full items-center gap-3 p-3 transition-colors hover:bg-base-300
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 rounded-full object-cover"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 ring-2 ring-zinc-900" />
                )}
              </div>

              <div className="hidden min-w-0 text-left lg:block">
                <div className="truncate font-medium">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}

          {filteredUsers.length === 0 && (
            <div className="py-4 text-center text-zinc-500">
              {showOnlineOnly ? "No online users" : "No chats yet"}
            </div>
          )}
        </div>
      </aside>

      <SearchUserModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        users={safeUsers}
        currentUserId={authUser?._id}
        onlineUsers={onlineUsers}
        onSelectUser={(user) => setSelectedUser(user)}
      />
    </>
  );
};

export default Sidebar;
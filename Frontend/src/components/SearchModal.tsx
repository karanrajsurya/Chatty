import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUserId?: string;
  onSelectUser: (user: User) => void;
  onlineUsers: string[];
}

const SearchUserModal = ({
  isOpen,
  onClose,
  users,
  currentUserId,
  onlineUsers,
  onSelectUser,
}: Props) => {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    return users.filter((user) => {
      if (user._id === currentUserId) return false;
      if (!normalizedQuery) return true;

      return (
        user.fullName.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [currentUserId, search, users]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-[min(90vw,32rem)] max-h-[80vh] overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-base-300 p-5">
          <h2 className="text-xl font-bold">Search Users</h2>
          <button className="btn btn-ghost btn-circle btn-sm" onClick={onClose} aria-label="Close search">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5">
          <label className="input input-bordered flex items-center gap-2 w-full">
            <Search size={18} />
            <input
              className="grow"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>

        <div className="h-[22rem] overflow-y-auto px-5 pb-5">
          {filteredUsers.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-base-300 text-sm text-base-content/60">
              No matching users found
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => {
                const isOnline = onlineUsers.includes(user._id);

                return (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => {
                      onSelectUser(user);
                      onClose();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl border border-base-300 bg-base-200/50 p-3 text-left transition hover:bg-base-300"
                  >
                    <div className="relative">
                      <img
                        src={user.profilePic || "/avatar.png"}
                        alt={user.fullName}
                        className="size-12 rounded-full object-cover"
                      />
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-base-100 bg-green-500" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{user.fullName}</div>
                      <div className="truncate text-sm text-base-content/60">{user.email}</div>
                    </div>

                    <span className={`badge badge-sm ${isOnline ? "badge-success" : "badge-ghost"}`}>
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUserModal;
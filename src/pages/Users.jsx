import { useState, useEffect } from 'react';
import Toast from '../components/Toast';
import { Icons } from '../components/Icons';
import API_URL from '../config/api';
import { useLanguage } from '../context/LanguageContext';

const DEFAULT_USERS = [
  { id: 1, name: 'Gabriel Marte', email: 'gabriel@byteforge.io', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Ana Gómez', email: 'ana.gomez@gmail.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Carlos Rodríguez', email: 'carlos.rod@outlook.com', role: 'Viewer', status: 'Pending' },
];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [editingUserId, setEditingUserId] = useState(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Viewer');
  const [newStatus, setNewStatus] = useState('Active');

  const { t } = useLanguage();

  // Obtenemos el usuario autenticado y evaluamos su rol
  const storedUser = JSON.parse(localStorage.getItem('user')) || { role: 'Viewer' };
  const isAdmin = storedUser.role === 'Admin';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('API offline o sin privilegios');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.warn('Usando almacenamiento local sincronizado:', err.message);
      const localStoredUsers = localStorage.getItem('byteforge_system_users');
      if (localStoredUsers) {
        setUsers(JSON.parse(localStoredUsers));
      } else {
        setUsers(DEFAULT_USERS);
        localStorage.setItem('byteforge_system_users', JSON.stringify(DEFAULT_USERS));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const saveUsersToStorage = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem('byteforge_system_users', JSON.stringify(updatedUsers));
  };

  const filteredUsers = users.filter(user =>
    (user.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = async (user) => {
    if (!isAdmin) {
      setToastMessage(t('adminActionDenied') || 'Acción denegada: Se requieren privilegios de Administrador.');
      return;
    }

    const nextStatus = user.status === 'Active' ? 'Pending' : 'Active';

    try {
      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: nextStatus })
      });

      if (!response.ok) throw new Error('Error al actualizar estado en el servidor');

      const updated = users.map(u => u.id === user.id ? { ...u, status: nextStatus } : u);
      saveUsersToStorage(updated);
      setToastMessage(`User ${user.name} is now ${nextStatus}.`);
    } catch (err) {
      const updated = users.map(u => u.id === user.id ? { ...u, status: nextStatus } : u);
      saveUsersToStorage(updated);
      setToastMessage(`User updated locally to ${nextStatus}.`);
    }
  };

  const handleOpenAddModal = () => {
    if (!isAdmin) {
      setToastMessage(t('adminActionDenied') || 'Acción denegada: Se requieren privilegios de Administrador.');
      return;
    }
    setEditingUserId(null);
    setNewName('');
    setNewEmail('');
    setNewRole('Viewer');
    setNewStatus('Active');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    if (!isAdmin) {
      setToastMessage(t('readOnlyPermission') || 'Acción denegada: Tu cuenta tiene permisos de lectura.');
      return;
    }
    setEditingUserId(user.id);
    setNewName(user.name);
    setNewEmail(user.email);
    setNewRole(user.role || 'Viewer');
    setNewStatus(user.status || 'Active');
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!newName || !newEmail || !isAdmin) return;

    try {
      if (editingUserId) {
        const response = await fetch(`${API_URL}/api/users/${editingUserId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ name: newName, email: newEmail, role: newRole, status: newStatus })
        });

        if (!response.ok) throw new Error('Error al guardar en el servidor');

        const updated = users.map(u => u.id === editingUserId ? { ...u, name: newName, email: newEmail, role: newRole, status: newStatus } : u);
        saveUsersToStorage(updated);
        setToastMessage(`User ${newName} updated successfully.`);
      } else {
        const newUser = {
          id: Date.now().toString(),
          name: newName,
          email: newEmail,
          role: newRole,
          status: newStatus
        };
        saveUsersToStorage([newUser, ...users]);
        setToastMessage(`User ${newName} created successfully.`);
      }
    } catch (err) {
      setToastMessage('Error al sincronizar con el backend.');
    }
    setIsModalOpen(false);
  };

  const handleDeleteUser = async (id, name) => {
    if (!isAdmin) {
      setToastMessage(t('deletePermissionDenied') || 'Acción denegada: No tienes permisos para eliminar usuarios.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete user ${name}?`)) {
      try {
        await fetch(`${API_URL}/api/users/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
      } catch (e) {
        console.warn('Eliminación local ejecutada');
      }

      const updated = users.filter(u => u.id !== id);
      saveUsersToStorage(updated);
      setToastMessage(`User ${name} removed.`);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'Editor': return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      default: return 'bg-slate-700/50 text-slate-300 border border-slate-600/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400 text-sm animate-pulse">{t('loading') || 'Loading records...'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t('usersTitle') || 'User Management & Approvals'}</h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('usersSubtitle') || 'Manage system users, approve pending accounts, and assign security roles.'} {!isAdmin && <span className="text-amber-400 font-semibold">(Modo Visualización)</span>}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/35 cursor-pointer whitespace-nowrap"
          >
            {Icons?.Add ? <Icons.Add className="w-4 h-4" /> : <span>➕</span>}
            <span>{t('addUser') || 'Add New User'}</span>
          </button>
        )}
      </div>

      <div className="bg-[#1e293b]/70 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-md shadow-xl space-y-4">
        <input
          type="text"
          placeholder={t('searchUsersPlaceholder') || 'Search by name or email...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-4 py-2.5 border border-slate-700 rounded-xl text-xs bg-slate-900/80 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
            <thead className="bg-slate-800/50 text-[11px] uppercase text-slate-400 border-b border-slate-700/60">
              <tr>
                <th className="px-4 py-3">{t('tableUser') || 'Name'}</th>
                <th className="px-4 py-3">{t('tableEmail') || 'Email'}</th>
                <th className="px-4 py-3">{t('tableRole') || 'Role'}</th>
                <th className="px-4 py-3">{t('tableStatus') || 'Status'}</th>
                {isAdmin && <th className="px-4 py-3 text-right">{t('tableActions') || 'Actions'}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-slate-200 whitespace-nowrap">{user.name}</td>
                    <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap">{user.email}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${getRoleBadge(user.role)}`}>
                        {user.role || 'Viewer'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        user.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                      }`}>
                        {user.status || 'Pending'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3.5 text-right space-x-3 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                            user.status === 'Active'
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {user.status === 'Active' ? (t('pauseBtn') || 'Pausar') : (t('approveBtn') || '✓ Aprobar')}
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-medium text-xs cursor-pointer"
                        >
                          <span>{t('editBtn') || 'Edit'}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="inline-flex items-center space-x-1 text-rose-400 hover:text-rose-300 font-medium text-xs cursor-pointer"
                        >
                          <span>{t('deleteBtn') || 'Delete'}</span>
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-4 py-6 text-center text-slate-400">
                    No users found matching "{search}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && isAdmin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1e293b] rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-700/80 space-y-4">
            <h2 className="text-lg font-bold text-white">
              {editingUserId ? (t('editUserTitle') || 'Edit User') : (t('addUserTitle') || 'Add New User')}
            </h2>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('fullNameLabel') || 'Full Name'}</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Sofia Martinez"
                  className="w-full px-4 py-2 border border-slate-700 rounded-xl text-xs bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('emailAddressLabel') || 'Email Address'}</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. sofia@byteforge.dev"
                  className="w-full px-4 py-2 border border-slate-700 rounded-xl text-xs bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('tableRole') || 'Role'}</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-700 rounded-xl text-xs bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Editor">Editor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('tableStatus') || 'Status'}</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-700 rounded-xl text-xs bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  {t('cancelBtn') || 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  {editingUserId ? (t('saveChangesBtn') || 'Save Changes') : (t('saveUserBtn') || 'Save User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && Toast ? (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      ) : toastMessage ? (
        <div className="fixed bottom-5 right-5 bg-indigo-600 text-white text-xs px-4 py-3 rounded-xl shadow-xl z-50">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}
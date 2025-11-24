import { useState, useEffect, useRef, useContext } from "react";
import { Users as UsersIcon, UserPlus, Filter, Search } from "lucide-react";
import { createUser, deleteUser, editUser, getAllUsers, getRoles, type Role } from "~/services/users";
import { t } from "i18next";
import { useLocation } from "react-router-dom";
import VenUsuario, { type VenUsuarioRefMethods, type UserFormData } from "./windows/VenUsuario";
import { Button } from "./ui/button";
import ToastContext, { useToast } from "~/contexts/ToastContext";

interface User {
  id: string;
  fullName: string;
  email: string;
  role?: Role;
  createdAt: string;
  updatedAt: string;
  twoFactorEnabled: boolean
}


export default function App() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>();
  const [roles, setRoles] = useState<Role[]>();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Boolean | null>(null);

  const modalRef = useRef<VenUsuarioRefMethods>(null);
  const { showError } = useToast()

  const [sortColumn, setSortColumn] = useState<'name' | 'role' | 'activity'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAllUsers(),
      getRoles()
    ])
      .then(([res1, res2]) => {
        setUsers(res1);
        setRoles(res2);
        setLoading(false);
      })
      .catch(() => {
        setUsers([]);
        setRoles([]);
        setLoading(false);
      });
  }, []);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    // if (roleParam && roleParam !== "permisos") {

    // } else if (roleParam && roleParam !== "todos") {
    // if (roleParam && roleParam !== "permisos") {

    if (roleParam && roleParam !== "todos") {
      setRoleFilter(roleParam);
    } else {
      setRoleFilter(null);
    }
  }, [location.search]);

  function handleCreateUser() {
    modalRef.current?.create();
  }

  function handleEditUser(item: UserFormData) {
    modalRef.current?.edit(item);
  }

  const handleSave = async (data: UserFormData) => {
    try {
      if (data.id) {
        await editUser(data.id, data);
      } else {
        await createUser(data);
      }
    } catch (err) {
      let errorMsg = 'Puedes reportar este fallo a nuestro equipo.';
      if (err instanceof Error) {
        errorMsg = err.message || errorMsg;
      } else if (typeof err === 'string') {
        errorMsg = err;
      }
      showError('¡Ups! Ocurrió algo.', errorMsg)
    } finally {
      getAllUsers().then((data) => setUsers(data))
    }
  };

  const handleDelete = async (userId: string) => {
    await deleteUser(userId);
  };


  // --- FILTERING AND SORTING LOGIC ---
  const filteredUsers = (users || []).filter((u) => {
    const roleName = typeof u.role === 'string' ? u.role : u.role?.name;

    const matchesSearch = searchTerm
      ? u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roleName?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesRole = roleFilter ? roleName === roleFilter : true;
    const matchesStatus = statusFilter !== null
      ? u.twoFactorEnabled === statusFilter
      : true;

    return matchesSearch && matchesRole && matchesStatus;
  }).sort((a, b) => {
    const getSortValue = (user: User) => {
      switch (sortColumn) {
        case 'name': return user.fullName.toLowerCase();
        case 'role': return (typeof user.role === 'string' ? user.role : user.role?.name)?.toLowerCase() || '';
        case 'activity': return user.updatedAt; // Assuming updatedAt represents activity
        default: return user.fullName.toLowerCase();
      }
    };

    const valA = getSortValue(a);
    const valB = getSortValue(b);

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const statusSelectValue = statusFilter === true
    ? "true"
    : statusFilter === false
      ? "false"
      : "";

  return (
    <>
      <VenUsuario ref={modalRef} onSave={handleSave} onDelete={handleDelete} roles={roles || []} />
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 font-sans">
        {loading ? (
          <div className="text-center p-10 text-xl text-gray-500">Cargando usuarios...</div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* HEADER */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex items-center gap-4">
                  <span className="bg-fuchsia-100 p-3 rounded-full flex items-center justify-center shadow-inner">
                    <UsersIcon className="text-fuchsia-700 w-6 h-6" />
                  </span>
                  <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-0.5">
                      {t('usersManagement', 'Gestión de Usuarios')}
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                      {users?.length} {t('usersFound', 'usuarios registrados')}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleCreateUser}
                  className="flex items-center gap-2 mt-4 sm:mt-0 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md">
                  <UserPlus className="w-5 h-5" />
                  Nuevo Usuario
                </Button>
              </div>
            </div>

            {/* BARRA DE BUSCADOR Y ORDENAMIENTO */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-4">
              {/* Contenedor de la barra principal (Buscador, Contador, Ordenamiento, Botón Filtros) */}
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                {/* Search Input Group */}
                <div className="flex-1 min-w-0 flex items-center border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-shadow w-full md:max-w-xl lg:max-w-3xl">
                  <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, email o rol..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 min-w-0 text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent py-0"
                  />
                </div>

                {/* User Count */}
                <p className="hidden md:block text-gray-500 text-sm font-medium whitespace-nowrap mx-4 shrink-0">
                  {filteredUsers.length} de {users?.length} usuarios
                </p>

                {/* Sort and Filter Controls */}
                <div className="flex gap-2 items-center w-full md:w-auto justify-between sm:justify-start flex-wrap shrink-0">
                  {/* Sort Column Select */}
                  <select
                    value={sortColumn}
                    onChange={e => setSortColumn(e.target.value as 'name' | 'role' | 'activity')}
                    className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-gray-700 font-medium shadow-sm appearance-none cursor-pointer hover:border-gray-400 transition-colors w-[28%] sm:w-auto"
                  >
                    <option value="name">Nombre</option>
                    <option value="role">Rol</option>
                    <option value="activity">Actividad</option>
                  </select>

                  {/* Sort Order Button (A-Z / Z-A) */}
                  <Button
                    type="button"
                    onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                    className={"border border-gray-300 rounded-xl px-3 py-2 bg-white flex items-center justify-center font-medium shadow-sm transition-all w-[20%] sm:w-auto " + (sortOrder === 'asc' ? 'text-blue-600 border-blue-600 hover:bg-blue-50' : 'text-gray-700 hover:bg-gray-50')}
                  >
                    {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                  </Button>

                  {/* Filters Button (Toggles the box below) */}
                  <Button
                    type="button"
                    // Aplica estilos para indicar que está activo
                    className={`rounded-xl px-4 py-2 flex items-center gap-1 font-semibold shadow-md transition-colors w-[45%] sm:w-auto ${showFilters ? 'bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    onClick={() => setShowFilters(f => !f)}>
                    <Filter className="w-4 h-4" />
                    Filtros
                  </Button>
                </div>
              </div>

              {/* CAJA DE FILTROS EXPANDIBLE (Aparece abajo al hacer clic) */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-1">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Columna Rol Filter */}
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium text-base mb-1">Rol</label>
                      <select
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors text-base"
                        value={roleFilter || ''}
                        onChange={e => setRoleFilter(e.target.value || null)}
                      >
                        <option value=''>Todos los roles</option>
                        {roles?.map((r, idx) => (
                          <option value={r.name} key={idx}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Columna Estado Filter */}
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium text-base mb-1">Estado</label>
                      <select
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors text-base"
                        value={statusSelectValue}
                        onChange={e => {
                          const value = e.target.value;
                          if (value === 'true') {
                            setStatusFilter(true);
                          } else if (value === 'false') {
                            setStatusFilter(false);
                          } else {
                            setStatusFilter(null);
                          }
                        }}
                      >
                        <option value=''>Todos los estados</option>
                        <option value={'true'}>Activo</option>
                        <option value={'false'}>Inactivo</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-left text-gray-600 uppercase tracking-wider">
                    <th className="p-4 font-semibold">{t('Name', "Nombre")}</th>
                    <th className="p-4 font-semibold">Rol</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Estado</th>
                    <th className="p-4 font-semibold">Última actividad</th>
                    <th className="p-4 font-semibold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500 text-base">
                        {t('noUsers', 'No se encontraron usuarios que coincidan con los filtros.')}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        className={`border-b border-gray-100 transition-colors cursor-pointer ${selectedUserId === u.id ? 'bg-blue-50 shadow-inner' : 'hover:bg-gray-50'}`}
                        onClick={() => setSelectedUserId(u.id)}
                      >
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-lg shadow-sm">
                            {u.fullName ? u.fullName.charAt(0) : "U"}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {u.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              Registro: {u.createdAt}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-700 font-medium">
                          {typeof u.role === 'string' ? u.role : u.role?.name}
                        </td>
                        <td className="p-4 text-gray-500">{u.email}</td>
                        <td className="p-4">
                          <span className={`text-xs px-3 py-1.5 font-semibold rounded-full ${u.twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {u.twoFactorEnabled ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500">{u.updatedAt}</td>
                        <td className="p-4 text-center">
                          <button
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            onClick={(e) => {
                              e.stopPropagation(); // evitar conflictos con onClick de la fila, si tienes
                              handleEditUser({
                                id: u.id,
                                fullName: u.fullName,
                                email: u.email,
                                role: typeof u.role === "string" ? u.role : u.role?.name,
                              });
                            }}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
import { useState, useEffect, useRef } from "react";
import { Users as UsersIcon, UserPlus, Filter, Search, Shield } from "lucide-react";
import { createUser, deleteUser, editUser, getAllUsers, getRoles, type Role } from "~/services/users";
import { t } from "i18next";
import { useLocation, useNavigate } from "react-router-dom";
import VenUsuario, { type VenUsuarioRefMethods, type UserFormData } from "./windows/VenUsuario";
import { SkeletonUsers } from './ui/LoadingSystem';
import { Button } from "./ui/button";
import { useToast } from "~/contexts/ToastContext";
import { howTimeWas } from "~/utils/fechas";

interface User {
  id: string;
  fullName: string;
  email: string;
  role?: Role;
  createdAt: string;
  updatedAt: string;
  status: boolean
}

type Mode = 'USUARIOS' | 'PERMISOS';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>();
  const [roles, setRoles] = useState<Role[]>();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [tab, setTab] = useState<Mode>('USUARIOS');
  const [statusFilter, setStatusFilter] = useState<Boolean | null>(null);

  const modalRef = useRef<VenUsuarioRefMethods>(null);
  const { showError } = useToast();
  const navigate = useNavigate();

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
  const params = new URLSearchParams(location.search);
  const roleParam = params.get('role');

  useEffect(() => {
    if (roleParam && roleParam === "permisos") {
      setTab('PERMISOS')
      setRoleFilter(null);
    } else if (roleParam && roleParam === "todos") {
      setTab('USUARIOS')
      setRoleFilter(null);
    } else {
      setTab('USUARIOS')
      setRoleFilter(roleParam);
    }
  }, [roleParam]);

  const reloadData = () => {
    setLoading(true);
    getAllUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setUsers([]);
        setLoading(false);
      });
  };


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
      reloadData()
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
    } catch (err) {
      let errorMsg = 'Puedes reportar este fallo a nuestro equipo.';
     if (err instanceof Error) {
        errorMsg = err.message || errorMsg;
      } else if (typeof err === 'string') {
        errorMsg = err;
      }
      showError('¡Ups! Ocurrió algo.', errorMsg)
    }finally{
      reloadData()
    }
  };

  const filteredUsers = (users || []).filter((u) => {
    const roleName = typeof u.role === 'string' ? u.role : u.role?.name;

    const matchesSearch = searchTerm
      ? u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roleName?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesRole = roleFilter ? roleName === roleFilter : true;
    const matchesStatus = statusFilter !== null
      ? u.status === statusFilter
      : true;

    return matchesSearch && matchesRole && matchesStatus;
  }).sort((a, b) => {
    const getSortValue = (user: User) => {
      switch (sortColumn) {
        case 'name': return user.fullName.toLowerCase();
        case 'role': return (typeof user.role === 'string' ? user.role : user.role?.name)?.toLowerCase() || '';
        case 'activity': return user.updatedAt;
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

  const canSeeUser: boolean = tab === 'USUARIOS';

  interface permissionData {
    name: string,
    checked: boolean
    readonly?: boolean
  }

  const rolesMap: { title: string, permissions: permissionData[] }[] = [
    {
      title: "Administrador",
      permissions: [
        { name: "Ver edificios", checked: true },
        { name: "Editar edificios", checked: true },
        { name: "Gestionar usuarios", checked: true },
        { name: "Ver informes", checked: true },
        { name: "Configuración sistema", checked: true },
        { name: "Acceso completo", checked: true },
        { name: "Gestionar documentos", checked: true },
        { name: "Generar reportes", checked: true },
      ]
    },
    {
      title: "Propietario",
      permissions: [
        { name: "Ver sus edificios", checked: true },
        { name: "Ver documentos", checked: true },
        { name: "Editar edificios", checked: false },
        { name: "Ver informes", checked: true },
        { name: "Gestión financiera", checked: true },
        { name: "Ver contratos", checked: true },
      ]
    },
    {
      title: "Técnico",
      permissions: [
        { name: "Ver edificios asignados", checked: true },
        { name: "Registrar mantenimiento", checked: true },
        { name: "Ver calendario", checked: true },
        { name: "Subir documentos", checked: true },
        { name: "Crear alertas", checked: true },
        { name: "Actualizar inspecciones", checked: true },
      ]
    },
    {
      title: "Inquilino",
      permissions: [
        { name: "Ver su unidad", checked: true },
        { name: "Ver documentos propios", checked: true },
        { name: "Crear incidencias", checked: true },
        { name: "Ver contrato", checked: false },
      ]
    }
  ];

  return (
    <>
      <VenUsuario ref={modalRef} onSave={handleSave} onDelete={handleDelete} roles={roles || []} />
      <div className="min-h-screen bg-gray-100 p-3 sm:p-4 font-sans rounded-2xl">
        {loading ? (
          <SkeletonUsers />
        ) : (
          <div className={`max-w-7xl mx-auto`}> 
            
            {/* HEADER */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <div className="flex items-center gap-3"> 
                  <span className="bg-purple-100 p-2 sm:p-3 rounded-lg flex items-center justify-center">
                    {canSeeUser ? <UsersIcon className="text-purple-600 w-5 h-5 sm:w-6 sm:h-6" /> : <Shield className="text-purple-600 w-5 h-5 sm:w-6 sm:h-6" />}
                  </span>
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl text-gray-900 font-semibold">
                      {canSeeUser ? t('User Manage', 'Gestión de Usuarios') : t('Permission Role', 'Gestión de Permisos')}
                    </h2>
                    {canSeeUser ? (<p className="text-xs sm:text-sm text-gray-500">
                      {users?.length} {t('usersFound', 'usuarios en el sistema')}
                    </p>) : (<p className="text-xs sm:text-sm text-gray-500">Administra roles y permisos de usuarios</p>)}
                  </div>
                </div>

                <Button
                  onClick={handleCreateUser}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-blue-700 text-sm transition-all shadow-sm hover:shadow-md">
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nuevo Usuario</span>
                  <span className="sm:hidden">Nuevo</span>
                </Button>
              </div>
            </div>

            {canSeeUser && <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 mb-4">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar por nombre, email o rol..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap hidden sm:block">
                      {filteredUsers.length} de {users?.length} usuarios
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <select
                      value={sortColumn}
                      onChange={e => setSortColumn(e.target.value as 'name' | 'role' | 'activity')}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-none min-w-0"
                    >
                      <option value="name">Nombre</option>
                      <option value="role">Rol</option>
                      <option value="activity">Actividad</option>
                    </select>

                    <Button
                      type="button"
                      onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 flex-shrink-0"
                    >
                      A-Z
                    </Button>

                    <Button
                      type="button"
                      className="flex items-center gap-2 px-3 py-2 border rounded-lg text-xs hover:bg-gray-50 border-gray-300 flex-shrink-0"
                      onClick={() => setShowFilters(f => !f)}>
                      <Filter className="w-3 h-3" />
                      <span>Filtros</span>
                    </Button>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 sm:hidden">
                  {filteredUsers.length} de {users?.length} usuarios
                </div>
              </div>

              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-1">
                  <div className="space-y-4">
                    {/* Filtro de Vista/Navegación - Solo en mobile */}
                    <div className="lg:hidden">
                      <label className="block text-gray-700 font-medium text-sm mb-2">Vista</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors text-sm"
                        value={roleParam === 'permisos' ? 'permisos' : roleParam === 'todos' ? 'todos' : roleFilter || 'todos'}
                        onChange={e => {
                          const value = e.target.value;
                          if (value === 'permisos') {
                            navigate('/users?role=permisos');
                            setTab('PERMISOS');
                            setRoleFilter(null);
                          } else if (value === 'todos') {
                            navigate('/users?role=todos');
                            setTab('USUARIOS');
                            setRoleFilter(null);
                          } else {
                            navigate(`/users?role=${encodeURIComponent(value)}`);
                            setTab('USUARIOS');
                            setRoleFilter(value);
                          }
                        }}
                      >
                        <option value='todos'>Todos los usuarios</option>
                        {roles?.map((r, idx) => (
                          <option value={r.name} key={idx}>
                            {r.name.charAt(0).toUpperCase() + r.name.slice(1).toLowerCase()}
                          </option>
                        ))}
                        <option value='permisos'>Gestión de permisos</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 w-full"> 
                        <label className="block text-gray-700 font-medium text-sm mb-2">Rol</label>
                        <select
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors text-sm"
                          value={roleFilter || ''}
                          onChange={e => setRoleFilter(e.target.value || null)}
                        >
                          <option value=''>Todos los roles</option>
                          {roles?.map((r, idx) => (
                            <option value={r.name} key={idx}>{r.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex-1 w-full"> 
                        <label className="block text-gray-700 font-medium text-sm mb-2">Estado</label>
                        <select
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors text-sm"
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
                </div>
              )}
            </div>}

            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              {canSeeUser && (
                <>
                  {/* TABLA PARA ESCRITORIO (oculta en móvil) */}
                  <div className="hidden lg:block border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 text-xs text-gray-600 font-semibold">{t('Name', "Nombre")}</th>
                          <th className="text-left py-2 px-3 text-xs text-gray-600 font-semibold">Rol</th>
                          <th className="text-left py-2 px-3 text-xs text-gray-600 font-semibold">Email</th>
                          <th className="text-left py-2 px-3 text-xs text-gray-600 font-semibold">Estado</th>
                          <th className="text-left py-2 px-3 text-xs text-gray-600 font-semibold">Última actividad</th>
                          <th className="text-left py-2 px-3 text-xs text-gray-600 font-semibold">Acciones</th>
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
                              <td className="py-2 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs text-blue-600 font-semibold">{u.fullName ? u.fullName.charAt(0) : "U"}</span>
                                  </div>
                                  <span className="text-xs text-gray-900">{u.fullName}</span>
                                </div>
                              </td>
                              <td className="py-2 px-3">
                                <span className="text-xs text-gray-700">{typeof u.role === 'string' ? u.role : u.role?.name}</span>
                              </td>
                              <td className="py-2 px-3">
                                <span className="text-xs text-gray-600">{u.email}</span>
                              </td>
                              <td className="py-2 px-3">
                                <span className={`inline-flex px-2 py-0.5 rounded text-xs ${u.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                  {u.status ? "Activo" : "Inactivo"}
                                </span>
                              </td>
                              <td className="py-2 px-3">
                                <span className="text-xs text-gray-500">{howTimeWas(u.updatedAt)}</span>
                              </td>
                              <td className="py-2 px-3">
                                <button
                                  className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditUser({
                                      id: u.id,
                                      fullName: u.fullName,
                                      email: u.email,
                                      role: typeof u.role === "string" ? u.role : u.role?.name,
                                      status: u.status
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
                  
                  {/* LISTA DE TARJETAS PARA MÓVIL (visible solo en móvil) */}
                  <div className="lg:hidden divide-y divide-gray-100">
                    {filteredUsers.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 text-base">
                        {t('noUsers', 'No se encontraron usuarios que coincidan con los filtros.')}
                      </div>
                    ) : (
                      filteredUsers.map((u) => (
                        <div
                          key={u.id}
                          className={`p-4 transition-colors cursor-pointer ${selectedUserId === u.id ? 'bg-blue-50 shadow-inner' : 'hover:bg-gray-50'}`}
                          onClick={() => setSelectedUserId(u.id)}
                          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedUserId(u.id)}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs text-blue-600 font-semibold">{u.fullName ? u.fullName.charAt(0) : "U"}</span>
                              </div>
                              <div>
                                <p className="text-xs text-gray-900 font-medium">{u.fullName}</p>
                                <p className="text-xs text-gray-600 truncate max-w-[200px]">{u.email}</p>
                              </div>
                            </div>
                            <button
                              className="text-xs text-blue-600 hover:text-blue-700 transition-colors shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditUser({
                                  id: u.id,
                                  fullName: u.fullName,
                                  email: u.email,
                                  role: typeof u.role === "string" ? u.role : u.role?.name,
                                  status: u.status
                                });
                              }}
                            >
                              Editar
                            </button>
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-xs text-gray-700">
                              {typeof u.role === 'string' ? u.role : u.role?.name}
                            </span>
                            <span className={`inline-flex px-2 py-0.5 rounded text-xs ${u.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                              {u.status ? "Activo" : "Inactivo"}
                            </span>
                          </div>
                          <p className="text-xs text-right text-gray-500 mt-1">
                            {howTimeWas(u.updatedAt)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

              {/* GESTIÓN DE PERMISOS */}
              {
                !canSeeUser && (
                  <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm"> {/* Más padding en sm+ */}
                    <div className="space-y-4"> {/* Más espacio entre secciones en sm+ */}
                      {
                        rolesMap.map((rol, idx) => {
                          return (
                            <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                              <h3 className="mb-3 font-semibold text-lg">{rol?.title}</h3> {/* Mejor jerarquía */}
                              {/* Grid: 2 columnas en móvil, 3 columnas en sm+ */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"> 
                                {
                                  rol?.permissions.map((per, idx) => {
                                    const { checked = false, name, readonly = false } = per
                                    return (
                                      <label key={idx} className="flex items-center gap-2">
                                        <input type="checkbox" readOnly={readonly} className="rounded text-blue-600 focus:ring-blue-500" checked={checked} />
                                        <span className="text-sm sm:text-base text-gray-700">{name}</span>
                                      </label>
                                    )
                                  })
                                }
                              </div>
                            </div>
                          )
                        })
                      }
                      {/* Sección de ejemplo genérica, ajustada a la nueva rejilla */}
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="mb-3 font-semibold text-lg">Nuevo Rol de Ejemplo</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" readOnly={false} className="rounded text-blue-600 focus:ring-blue-500" checked={false} />
                            <span className="text-sm sm:text-base text-gray-700">Ver edificios</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" readOnly={false} className="rounded text-blue-600 focus:ring-blue-500" checked={false} />
                            <span className="text-sm sm:text-base text-gray-700">Editar edificios</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" readOnly={false} className="rounded text-blue-600 focus:ring-blue-500" checked={false} />
                            <span className="text-sm sm:text-base text-gray-700">Gestionar usuarios</span>
                          </label>
                          <label className="flex items-center gap-2"><input type="checkbox" readOnly={false} className="rounded text-blue-600 focus:ring-blue-500" checked={false} />
                            <span className="text-sm sm:text-base text-gray-700">Ver informes</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" readOnly={false} className="rounded text-blue-600 focus:ring-blue-500" checked={false} />
                            <span className="text-sm sm:text-base text-gray-700">Configuración sistema</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    {/* Botones de acción al final: Alinear a la derecha y ocupar ancho completo en móvil */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 flex-col-reverse sm:flex-row">
                      <Button
                        type="button"
                        className="rounded-xl bg-gray-100 text-gray-800 px-4 py-2 text-sm font-medium hover:bg-gray-200 transition w-full sm:w-auto"
                      > Cancelar </Button>
                      <Button
                        type="button"
                        className="rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition w-full sm:w-auto"
                      >
                        Guardar cambios
                      </Button>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        )}
      </div>
    </>
  );
}
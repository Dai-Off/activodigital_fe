import { useState, useEffect, useRef } from "react";
import { Users as UsersIcon, UserPlus, Filter, Search, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { createUser, deleteUser, editUser, getAllUsers, getRoles, type Role } from "~/services/users";
import { t } from "i18next";
import { useLocation } from "react-router-dom";
import VenUsuario, { type VenUsuarioRefMethods, type UserFormData } from "./windows/VenUsuario";
import { SkeletonUsers } from './ui/LoadingSystem';
import { Button } from "./ui/button";
import { useToast } from "~/contexts/ToastContext";
import { formatofechaCorta, howTimeWas } from "~/utils/fechas";
import { useIsMobile } from "./ui/use-mobile";

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
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>();
  const [roles, setRoles] = useState<Role[]>();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [tab, setTab] = useState<Mode>('USUARIOS');
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
  const isMobile = useIsMobile();
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
      <div className={`min-h-screen bg-gray-100 p-4 font-sans rounded-2xl ${isMobile ? 'ml-13' : ''}`}>
        {loading ? (
          <SkeletonUsers />
        ) : (
          <div className={`max-w-7xl mx-auto`}> 
            
            {/* HEADER */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex items-center gap-4 mb-4 sm:mb-0"> 
                  <span className="bg-fuchsia-100 p-3 rounded-full flex items-center justify-center shadow-inner">
                    {canSeeUser ? <UsersIcon className="text-fuchsia-700 w-6 h-6" /> : <Shield className="text-fuchsia-700 w-6 h-6" />}
                  </span>
                  <div>
                    <h1 className="text-xl sm:text-2xl text-gray-900 mb-0.5">
                      {canSeeUser ? t('User Manage', 'Gestión de Usuarios') : t('Permission Role', 'Gestión de Permisos')}
                    </h1>
                    {canSeeUser ? (<p className="text-sm text-gray-500 font-medium">
                      {users?.length} {t('usersFound', 'usuarios registrados')}
                    </p>) : (<p className="text-sm text-gray-500 font-medium">Administra roles y permisos de usuarios</p>)}
                  </div>
                </div>

                <Button
                  onClick={handleCreateUser}
                  className="w-full sm:w-auto flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md">
                  <UserPlus className="w-5 h-5" />
                  Nuevo Usuario
                </Button>
              </div>
            </div>

            {canSeeUser && <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-4">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                
                <div className="flex-1 min-w-0 flex items-center border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-shadow w-full md:max-w-xl lg:max-w-3xl">
                  <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, email o rol..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 min-w-0 text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent py-0 text-sm sm:text-base"
                  />
                </div>

                <p className={`text-gray-500 text-sm font-medium whitespace-nowrap mx-4 shrink-0 ${isMobile ? 'order-3 mt-2' : 'hidden md:block'}`}>
                  {filteredUsers.length} de {users?.length} usuarios
                </p>

                <div className="flex gap-2 items-center w-full md:w-auto justify-between sm:justify-start flex-wrap shrink-0">
                  <select
                    value={sortColumn}
                    onChange={e => setSortColumn(e.target.value as 'name' | 'role' | 'activity')}
                    className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-gray-700 font-medium shadow-sm appearance-none cursor-pointer hover:border-gray-400 transition-colors w-[35%] sm:w-auto text-sm"
                  >
                    <option value="name">Nombre</option>
                    <option value="role">Rol</option>
                    <option value="activity">Actividad</option>
                  </select>

                  <Button
                    type="button"
                    onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                    className={"border border-gray-300 rounded-xl px-3 py-2 bg-white flex items-center justify-center font-medium shadow-sm transition-all w-[25%] sm:w-auto text-sm " + (sortOrder === 'asc' ? 'text-blue-600 border-blue-600 hover:bg-blue-50' : 'text-gray-700 hover:bg-gray-50')}
                  >
                    {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                    {isMobile ? '' : (sortOrder === 'asc' ? 'Asc' : 'Desc')}
                  </Button>

                  <Button
                    type="button"
                    className={`rounded-xl px-4 py-2 flex items-center gap-1 font-semibold shadow-md transition-colors w-[35%] sm:w-auto text-sm ${showFilters ? 'bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    onClick={() => setShowFilters(f => !f)}>
                    <Filter className="w-4 h-4" />
                    {isMobile ? '' : 'Filtros'}
                  </Button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-1">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 w-full"> 
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

                    <div className="flex-1 w-full"> 
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
            </div>}

            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-hidden">
              {canSeeUser && (
                <>
                  {/* TABLA PARA ESCRITORIO (oculta en móvil) */}
                { !isMobile && <table className="min-w-full text-xs **hidden sm:table**">
                    <thead className="text-xs">
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
                              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-lg shadow-sm shrink-0">
                                {u.fullName ? u.fullName.charAt(0) : "U"}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {u.fullName}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-gray-700 font-medium">
                              {typeof u.role === 'string' ? u.role : u.role?.name}
                            </td>
                            <td className="p-4 text-gray-500">{u.email}</td>
                            <td className="p-4">
                              <span className={`text-xs px-3 py-1.5 font-semibold rounded-full ${u.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {u.status ? "Activo" : "Inactivo"}
                              </span>
                            </td>
                            <td className="p-4 text-gray-500" title={formatofechaCorta(u.updatedAt)}>{howTimeWas(u.updatedAt)}</td>
                            <td className="p-4 text-center">
                              <button
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
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
                  </table>}
                  
                  {/* LISTA DE TARJETAS PARA MÓVIL (oculta en sm+) */}
                 {isMobile && <div className="divide-y divide-gray-100 **sm:hidden**">
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
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-sm shadow-sm shrink-0">
                                {u.fullName ? u.fullName.charAt(0) : "U"}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{u.fullName}</p>
                                <p className="text-xs text-gray-500 truncate max-w-[200px]">{u.email}</p>
                              </div>
                            </div>
                            <button
                              className="text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
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
                          </div>
                          <div className="mt-2 flex justify-between items-center text-xs">
                            <span className="text-gray-700 font-medium">
                              {typeof u.role === 'string' ? u.role : u.role?.name}
                            </span>
                            <span className={`text-xs px-2 py-1 font-semibold rounded-full ${u.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {u.status ? "Activo" : "Inactivo"}
                            </span>
                          </div>
                          <p className="text-xs text-right text-gray-400 mt-1">
                            Actividad: {formatofechaCorta(u.updatedAt)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>}
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
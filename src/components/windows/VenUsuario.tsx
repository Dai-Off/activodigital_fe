import React, { useState, useImperativeHandle, forwardRef } from "react";
import type { Role } from "~/services/users";
import { useIsMobile } from "../ui/use-mobile";
import { Trash2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface UserFormData {
  id?: string;
  email?: string;
  fullName?: string;
  role?: string;
  status?: boolean;
}

export interface VenUsuarioRefMethods {
  create: () => void;
  edit: (item: UserFormData) => void;
  close: () => void;
}

interface VenUsuarioProps {
  onSave: (values: UserFormData) => Promise<void> | void;
  onDelete?: (userId: string) => Promise<void> | void;
  roles: Role[];
}

const VenUsuario = forwardRef<VenUsuarioRefMethods, VenUsuarioProps>(
  ({ onSave, onDelete, roles }, ref) => {
    const [visible, setVisible] = useState(false);
    const isMobile = useIsMobile();
    const [form, setForm] = useState<UserFormData>({
      email: "",
      fullName: "",
      role: "",
      status: true,
    });
    const { t } = useTranslation()
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState<
      Partial<Record<keyof UserFormData, string>>
    >({});

    useImperativeHandle(ref, () => ({
      create: () => {
        setForm({ email: "", fullName: "", role: "", status: true });
        setIsEdit(false);
        setErrors({});
        setVisible(true);
      },
      edit: (item: UserFormData) => {
        setForm(item);
        setIsEdit(true);
        setErrors({});
        setVisible(true);
      },
      close: () => setVisible(false),
    }));

    const validate = () => {
      const newErrs: Partial<Record<keyof UserFormData, string>> = {};
      if (!form.fullName?.trim()) newErrs.fullName = "El nombre es obligatorio";
      if (!form.email?.trim()) newErrs.email = "El email es obligatorio";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        newErrs.email = "Debe ser un email válido";
      if (!form.role) newErrs.role = "El rol es obligatorio";
      setErrors(newErrs);
      return Object.keys(newErrs).length === 0;
    };

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const value =
        e.target.name === "status" ? e.target.value === "true" : e.target.value;
      setForm({ ...form, [e.target.name]: value });
      setErrors((errs) => ({ ...errs, [e.target.name]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      await onSave(form);
      setVisible(false);
    };

    const handleDelete = async () => {
      if (onDelete && form.id) {
        await onDelete(form.id);
        setVisible(false);
      }
    };

    if (!visible) return null;
    return (
      <div
        onClick={() => setVisible(!visible)}
        className={`fixed z-50 backdrop-blur-sm inset-0 bg-black/30 flex 
        ${
          isMobile ? "items-start pt-10 ml-16" : "items-center"
        } justify-center`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`
        bg-white rounded-lg shadow-lg 
        w-full 
        ${isMobile ? "h-[90vh] mx-2 p-5" : "max-w-lg mx-3 px-7 py-8"} 
        overflow-y-auto
    `}
        >
          <div className={`${isMobile ? "px-2" : "px-7"}`}>
            <h1
              className={`${
                isMobile ? "text-xl" : "text-2xl"
              } font-bold text-gray-900 mb-1`}
            >
              {isEdit ? "Editar usuario" : "Nuevo usuario"}
            </h1>
            <p className="text-gray-600 mb-3 text-sm">
              {isEdit
                ? "Modifica los datos del usuario."
                : "Agrega un nuevo usuario al sistema."}
            </p>
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Nombre completo */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t('Fullname', 'Nombre completo')}<span className="text-primary">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName || ""}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez"
                  required
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.fullName ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t('Email', 'Correo electrónico')}<span className="text-primary">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email || ""}
                  onChange={handleChange}
                  required
                  placeholder="usuario@email.com"
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              {/* Rol */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t('Role', 'Rol')} <span className="text-primary">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role || ""}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.role ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((rol, idx) => {
                    return (
                      <option key={idx} value={rol?.name}>
                        {rol?.name}
                      </option>
                    );
                  })}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t('Status', 'Estado')} <span className="text-primary">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status === undefined ? "" : String(form.status)}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.status ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Selecciona un rol</option>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row pt-5  justify-between">
                <button
                  type="button"
                  onClick={() => setVisible(false)}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {t('Cancel', 'Cancelar')}
                </button>
                <div className=" gap-1 flex justify-between">
                  {isEdit && onDelete && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      <Trash2Icon className="inline mr-2 h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-auto"
                  >
                    {isEdit ? t('Save', "Guardar cambios") : t('Create',"Crear usuario")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
);

export default VenUsuario;

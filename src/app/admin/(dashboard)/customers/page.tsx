"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Plus, 
  Search, 
  User, 
  Edit2, 
  Trash2, 
  Loader2,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  ChevronLeft,
  ChevronRight,
  History,
  Filter,
  FileText
} from "lucide-react";
import { toast } from "react-hot-toast";
import FloatingLabelInput from "@/components/admin/FloatingLabelInput";
import SuccessMessage from "@/components/admin/SuccessMessage";
import MobileCardList from "@/components/admin/MobileCardList";
import { useBreakpoint } from "@/hooks/useBreakpoint";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  license_number: string;
  cin_number: string;
  address: string;
  birth_date: string;
  created_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    fetchCustomers();
  }, [pagination.current_page]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/customers?page=${pagination.current_page}&search=${search}`);
      const data = await response.json();
      setCustomers(data.data);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total
      });
    } catch (error) {
      toast.error("Erreur lors du chargement des clients");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/customers/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Client supprimé");
        fetchCustomers();
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="admin-header-title">
            Fichier <span className="text-[var(--color-primary)]">Clients</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-[var(--color-primary)] rounded-full" />
            <p className="admin-header-subtitle">{pagination.total} Clients enregistrés</p>
          </div>
        </div>
        
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="admin-btn-primary group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Plus size={22} className="relative z-10" />
            <span className="relative z-10">Nouveau Client</span>
          </button>
        )}
      </div>

      {showForm && (
        <CustomerFormModal
          initialData={editingCustomer}
          onSuccess={() => {
            setShowForm(false);
            setEditingCustomer(null);
            fetchCustomers();
          }}
          onClose={() => {
            setShowForm(false);
            setEditingCustomer(null);
          }}
        />
      )}

      {!showForm && (
        <div className="space-y-6">
          {/* Customers Table - Desktop */}
          <div className="hidden md:block admin-table-container">
            {loading ? (
              <div className="p-32 flex flex-col items-center justify-center text-gray-400 gap-6">
                <Loader2 size={40} className="animate-spin text-[var(--color-primary)]" />
                <p className="admin-label tracking-[0.3em]">Synchronisation des clients...</p>
              </div>
            ) : customers.length === 0 ? (
              <div className="p-32 text-center text-gray-500">
                <User size={48} className="mx-auto mb-4 opacity-20 text-gray-500" />
                <p className="admin-label tracking-[0.3em]">Aucun client trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto admin-scroll-container">
                <table className="w-full text-left border-none">
                  <thead>
                    <tr>
                      <th className="admin-table-th">Identité</th>
                      <th className="admin-table-th">Contact</th>
                      <th className="admin-table-th">Documents</th>
                      <th className="admin-table-th">Inscrit le</th>
                      <th className="admin-table-th text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/50">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="admin-table-row group">
                        <td className="admin-table-td">
                          <div className="flex flex-col">
                            <span className="admin-table-primary-text uppercase tracking-wider">{customer.first_name} {customer.last_name}</span>
                            <span className="admin-table-secondary-text font-bold uppercase tracking-widest mt-1">ID #{customer.id}</span>
                          </div>
                        </td>
                        <td className="admin-table-td">
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-2 text-[13px] font-bold text-[#1A3B5D]">
                              <Mail size={12} className="text-gray-400" /> {customer.email}
                            </span>
                            <span className="flex items-center gap-2 admin-table-secondary-text font-bold uppercase tracking-widest">
                              <Phone size={12} /> {customer.phone}
                            </span>
                          </div>
                        </td>
                        <td className="admin-table-td">
                          <div className="flex flex-col gap-1">
                            <span className="admin-table-secondary-text font-bold uppercase tracking-widest">Permis: <span className="text-[#1A3B5D] tracking-normal">{customer.license_number || "—"}</span></span>
                            <span className="admin-table-secondary-text font-bold uppercase tracking-widest">CIN: <span className="text-[#1A3B5D] tracking-normal">{customer.cin_number || "—"}</span></span>
                          </div>
                        </td>
                        <td className="admin-table-td">
                          <span className="admin-table-secondary-text font-bold uppercase tracking-[0.2em]">
                            {new Date(customer.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="admin-table-td text-right">
                          <div className="admin-actions-container">
                            <button 
                              onClick={() => { setEditingCustomer(customer); setShowForm(true); }}
                              className="admin-btn-icon"
                              title="Modifier"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(customer.id)}
                              className="admin-btn-icon !text-red-500 hover:!bg-red-500 hover:!text-white"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Mobile Cards View */}
          {isMobile && (
            <div className="md:hidden">
              {loading ? (
                <div className="p-16 flex flex-col items-center justify-center text-gray-400 gap-4">
                  <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
                  <p className="admin-label tracking-[0.3em] text-[9px]">Synchronisation...</p>
                </div>
              ) : customers.length === 0 ? (
                <div className="p-16 text-center text-gray-500">
                  <User size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="admin-label tracking-[0.3em] text-[9px]">Aucun client trouvé</p>
                </div>
              ) : (
                <MobileCardList
                  items={customers.map((customer) => ({
                    title: `${customer.first_name} ${customer.last_name}`,
                    subtitle: `ID #${customer.id} • Inscrit le ${new Date(customer.created_at).toLocaleDateString()}`,
                    leftIcon: <User size={20} />,
                    badge: {
                      text: customer.license_number ? "Vérifié" : "En attente",
                      variant: customer.license_number ? "success" : "warning",
                    },
                    actions: (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCustomer(customer);
                            setShowForm(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[var(--color-bg)] hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-primary)] rounded-xl transition-all text-[10px] font-black uppercase tracking-wider min-h-[44px]"
                        >
                          <Edit2 size={14} />
                          Modifier
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(customer.id);
                          }}
                          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all text-[10px] font-black uppercase tracking-wider min-h-[44px]"
                        >
                          <Trash2 size={14} />
                          Supprimer
                        </button>
                      </>
                    ),
                  }))}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CustomerFormModal({ initialData, onSuccess, onClose }: any) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(initialData || {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    license_number: "",
    cin_number: "",
    address: "",
    birth_date: "",
  });

  useEffect(() => {
    setMounted(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = initialData 
        ? `http://127.0.0.1:8000/api/customers/${initialData.id}` 
        : "http://127.0.0.1:8000/api/customers";
        
      const response = await fetch(url, {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onSuccess();
        }, 3000);
      } else {
        const error = await response.json();
        toast.error(error.message || "Une erreur est survenue");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const customerName = `${formData.first_name} ${formData.last_name}`;
    return (
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1000] flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[85vh] overflow-y-auto relative animate-scale-in shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-[100px] opacity-10" />
          <div className="p-8 sm:p-10 lg:p-12">
            <SuccessMessage
              title="Client"
              highlightedText={initialData ? "Mis à jour avec succès !" : "Créé avec succès !"}
              message={`${customerName} a été ${initialData ? "modifié" : "ajouté"} avec succès dans votre base de clients.`}
              autoCloseDelay={3000}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    );
  }

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1000] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[2.5rem] max-w-4xl w-full max-h-[85vh] overflow-y-auto relative animate-scale-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-[100px] opacity-10" />
        
        <div className="sticky top-0 z-20 bg-white rounded-t-[2.5rem] p-8 sm:p-10 lg:p-12 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-black text-[var(--color-primary)] mb-2 uppercase">
                {initialData ? "Modifier" : "Ajouter"} <span className="text-[var(--color-secondary)]">Client</span>
              </h2>
              <p className="text-[var(--color-text-muted)] font-light">
                {initialData ? "Modifier les informations du client" : "Remplissez le formulaire pour créer un nouveau client"}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-[var(--color-bg)] rounded-xl text-gray-400 hover:text-[var(--color-primary)] transition-all ml-4 flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8 sm:p-10 lg:p-12">

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Identité & Contact</label>
              <div className="grid grid-cols-2 gap-4">
                <FloatingLabelInput
                  id="first_name"
                  label="Prénom"
                  value={formData.first_name}
                  onChange={(val) => setFormData({...formData, first_name: val})}
                  required
                />
                <FloatingLabelInput
                  id="last_name"
                  label="Nom"
                  value={formData.last_name}
                  onChange={(val) => setFormData({...formData, last_name: val})}
                  required
                />
              </div>
              <FloatingLabelInput
                id="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={(val) => setFormData({...formData, email: val})}
                required
                validate={(val) => val && !val.includes('@') ? 'Email invalide' : null}
              />
              <FloatingLabelInput
                id="phone"
                label="Téléphone"
                type="tel"
                value={formData.phone}
                onChange={(val) => setFormData({...formData, phone: val})}
                required
              />
            </div>

            <div className="space-y-6">
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Documents & Adresse</label>
              <div className="grid grid-cols-2 gap-4">
                <FloatingLabelInput
                  id="license_number"
                  label="N° Permis"
                  value={formData.license_number}
                  onChange={(val) => setFormData({...formData, license_number: val})}
                />
                <FloatingLabelInput
                  id="cin_number"
                  label="N° CIN / Passeport"
                  value={formData.cin_number}
                  onChange={(val) => setFormData({...formData, cin_number: val})}
                />
              </div>
              <FloatingLabelInput
                id="birth_date"
                label="Date de naissance"
                type="date"
                value={formData.birth_date}
                onChange={(val) => setFormData({...formData, birth_date: val})}
              />
              <div className="relative">
                <label
                  htmlFor="address"
                  className={`absolute left-5 transition-all duration-300 pointer-events-none font-black uppercase tracking-[0.15em] ${
                    formData.address
                      ? 'top-2 text-[8px] text-[var(--color-secondary)]'
                      : 'top-4 text-[9px] text-gray-400'
                  }`}
                >
                  Adresse complète
                </label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-[var(--color-bg)] border-2 border-transparent rounded-xl px-5 py-4 pt-6 min-h-[100px] normal-case outline-none focus:ring-4 focus:ring-[var(--color-secondary)]/10 focus:border-[var(--color-secondary)] transition-all font-bold text-sm hover:border-gray-200"
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-6 pt-6 border-t border-gray-200">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-10 py-4 bg-transparent border border-gray-300 text-gray-500 font-black uppercase tracking-widest rounded-xl hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all active:scale-95"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] text-white font-black py-4 px-10 rounded-xl uppercase tracking-widest text-xs transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : initialData ? (
                <Edit2 size={20} />
              ) : (
                <Plus size={20} />
              )}
              {initialData ? "Enregistrer" : "Créer le client"}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
